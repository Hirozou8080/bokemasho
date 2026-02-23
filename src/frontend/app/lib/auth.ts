"use client";

import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.100:8080/api";

// =======================
// Personal Access Token 認証用ユーティリティ
// =======================

const TOKEN_KEY = "access_token";
const USER_KEY = "user_data";
const USER_CACHE_TIME_KEY = "user_cache_time";
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5分

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ユーザー情報をlocalStorageに保存（キャッシュ時刻も記録）
export const setUserData = (user: any) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(USER_CACHE_TIME_KEY, Date.now().toString());
};

// ユーザー情報をlocalStorageから取得
export const getUserData = (): any | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

// キャッシュが有効かどうかを確認
const isCacheValid = (): boolean => {
  if (typeof window === "undefined") return false;
  const cacheTime = localStorage.getItem(USER_CACHE_TIME_KEY);
  if (!cacheTime) return false;
  const elapsed = Date.now() - parseInt(cacheTime, 10);
  return elapsed < CACHE_DURATION_MS;
};

// ユーザー情報をクリア
export const clearUserData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
};

// 認証ヘッダー生成
const authHeaders = () => {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}` }
    : ({} as Record<string, string>);
};

// 共通ヘッダー（JSON かつ Bearer があれば付与）
const jsonHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  ...authHeaders(),
});

// CSRF ベースの SPA 認証は不要になったが、既存コード互換のため空関数を残す
export const getCsrfToken = async (): Promise<void> => {
  /* no-op for token auth */
};

// 旧 SPA 認証で使用していた XSRF トークン取得関数のダミー実装
export const getXsrfToken = async (): Promise<string> => {
  // トークンベース認証では不要なので空文字列を返す
  return "";
};

// ログイン
export const login = async (email: string, password: string): Promise<any> => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    } as HeadersInit,
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "ログインに失敗しました");
  }

  const data = await response.json();
  if (data.token) setToken(data.token);
  if (data.user) setUserData(data.user);
  return data;
};

// ログアウト
export const logout = async (): Promise<any> => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: jsonHeaders(),
  });

  clearToken();

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "ログアウトに失敗しました");
  }

  return response.json();
};

// ユーザー情報取得（キャッシュ優先、5分で期限切れ）
export const getUser = async (forceRefresh = false): Promise<any> => {
  // キャッシュがあり、有効期限内で、強制リフレッシュでなければキャッシュを返す
  if (!forceRefresh && isCacheValid()) {
    const cachedUser = getUserData();
    if (cachedUser) {
      return { user: cachedUser };
    }
  }

  // トークンがなければnullを返す
  const token = getToken();
  if (!token) {
    return null;
  }

  const response = await fetch(`${API_URL}/user`, {
    headers: jsonHeaders(),
  });

  if (!response.ok) {
    // 認証エラーの場合はキャッシュもクリア
    if (response.status === 401) {
      clearToken();
    }
    return null;
  }

  const data = await response.json();
  // レスポンスをキャッシュに保存
  setUserData(data);
  return { user: data };
};

// パスワードリセットメール送信
export const sendPasswordResetLink = async (email: string): Promise<any> => {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "パスワードリセットリンクの送信に失敗しました"
    );
  }

  return response.json();
};

// パスワードリセット
export const resetPassword = async (
  email: string,
  password: string,
  password_confirmation: string,
  token: string
): Promise<any> => {
  const response = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      password_confirmation,
      token,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "パスワードのリセットに失敗しました");
  }

  return response.json();
};

// 新規ユーザー登録
export const register = async (
  username: string,
  email: string,
  password: string,
  password_confirmation: string
): Promise<any> => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    } as HeadersInit,
    body: JSON.stringify({
      username,
      email,
      password,
      password_confirmation,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "登録に失敗しました");
  }

  const data = await response.json();
  // トークンは保存しない（メール確認後にログインしてもらう）
  return data;
};

// プロフィール更新（アイコン画像を含む場合はFormDataを使用）
export const updateProfile = async (userData: {
  username?: string;
  bio?: string;
  icon?: File;
}): Promise<any> => {
  const formData = new FormData();

  if (userData.username !== undefined) {
    formData.append("username", userData.username);
  }
  if (userData.bio !== undefined) {
    formData.append("bio", userData.bio);
  }
  if (userData.icon) {
    formData.append("icon", userData.icon);
  }

  const token = getToken();
  const response = await fetch(`${API_URL}/profile`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Profile update error:", error);
    throw new Error(error.message || "プロフィールの更新に失敗しました");
  }

  const data = await response.json();

  // 更新されたユーザー情報をキャッシュに保存
  if (data.data) {
    setUserData(data.data);
  }

  return data;
};
