"use client";

import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.100:8080/api";

// =======================
// Personal Access Token 認証用ユーティリティ
// =======================

const TOKEN_KEY = "access_token";

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

// ユーザー情報取得
export const getUser = async (): Promise<any> => {
  const response = await fetch(`${API_URL}/user`, {
    headers: jsonHeaders(),
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
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
  if (data.token) setToken(data.token);
  return data;
};

// プロフィール更新
export const updateProfile = async (userData: {
  username?: string;
  bio?: string;
}): Promise<any> => {
  const response = await fetch(`${API_URL}/profile`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "プロフィールの更新に失敗しました");
  }

  return response.json();
};
