"use client";

import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.100:8080/api";

// CSRFトークン取得
export const getCsrfToken = async (): Promise<void> => {
  try {
    const response = await fetch(
      `${API_URL.replace("/api", "")}/sanctum/csrf-cookie`,
      {
        credentials: "include",
        mode: "cors",
      }
    );

    console.log("CSRFトークン取得");
    console.log(response); //  トークンがCookieに設定される時間を確保
    await new Promise((resolve) => setTimeout(resolve, 100));

    // コンソールログを削除
  } catch (error) {
    console.error("CSRF token fetch error:", error);
  }
};

// ログイン
export const login = async (email: string, password: string): Promise<any> => {
  await getCsrfToken();

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-XSRF-TOKEN": await getXsrfToken(),
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "ログインに失敗しました");
  }
  return response.json();
};

// ログアウト
export const logout = async (): Promise<any> => {
  await getCsrfToken();

  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-XSRF-TOKEN": await getXsrfToken(),
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "ログアウトに失敗しました");
  }

  return response.json();
};

// ユーザー情報取得
export const getUser = async (): Promise<any> => {
  await getCsrfToken();

  const response = await fetch(`${API_URL}/user`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-XSRF-TOKEN": await getXsrfToken(),
    },
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};

// パスワードリセットメール送信
export const sendPasswordResetLink = async (email: string): Promise<any> => {
  await getCsrfToken();

  const response = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-XSRF-TOKEN": await getXsrfToken(),
    },
    credentials: "include",
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
  await getCsrfToken();

  // Cookieからxsrf-tokenを取得
  const cookies = document.cookie.split(";");
  let xsrfToken = "";
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "XSRF-TOKEN") {
      xsrfToken = decodeURIComponent(value);
      break;
    }
  }

  const response = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-XSRF-TOKEN": xsrfToken,
    },
    credentials: "include",
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
  await getCsrfToken();

  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-XSRF-TOKEN": await getXsrfToken(),
    },
    credentials: "include",
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

  return response.json();
};

// プロフィール更新
export const updateProfile = async (userData: {
  username?: string;
  bio?: string;
}): Promise<any> => {
  await getCsrfToken();

  const response = await fetch(`${API_URL}/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-XSRF-TOKEN": await getXsrfToken(),
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "プロフィールの更新に失敗しました");
  }

  return response.json();
};

// xsrfTokenを取得
export const getXsrfToken = () => {
  const cookies = document.cookie.split(";");
  let xsrfToken = "";

  // すべてのCookieをログ出力して確認
  console.log("All cookies:", cookies);

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    console.log(`Cookie ${name}: ${value}`);

    if (name === "XSRF-TOKEN") {
      xsrfToken = decodeURIComponent(value);
      console.log("Found regular XSRF token");
    } else if (name === "ENC_XSRF-TOKEN") {
      xsrfToken = decodeURIComponent(value);
      console.log("Found encrypted XSRF token");
    }
  }

  if (!xsrfToken) {
    console.error("XSRF-TOKEN not found");
  }

  return xsrfToken;
};
