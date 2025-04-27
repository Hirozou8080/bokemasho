/**
 * fetch関数を使ったAPI疎通
 *  @param {*}  url
 *  @param {*}  postData
 *  @param {*}  file =
 * @returns
 */
export async function fetchPost(props: any) {
  const {
    url = "", // API疎通URL
    postData = {}, // ポストデータ
    file = false, // ファイル送信時
  } = props;
  const baseUrl = process.browser
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : process.env.NEXT_PUBLIC_BACKEND_CONTAINER_URL;

  const response = await fetch(baseUrl + url, {
    method: "POST",
    credentials: "include", // クッキーを送信する設定
    headers: file ? {} : { "Content-Type": "application/json" },
    body: file ? postData : JSON.stringify(postData),
  });

  return response;
}

/**
 * fetch関数を使ったAPI疎通
 * @param {*} props
 * @returns
 */
export async function fetchGet(props: any) {
  const {
    url = "", // API疎通URL
    cache = "force-cache",
  } = props;
  const baseUrl = process.browser
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : process.env.NEXT_PUBLIC_BACKEND_CONTAINER_URL;

  return await fetch(baseUrl + url, {
    method: "GET",
    cache: cache,
    headers: { "Content-Type": "application/json" },
    credentials: "include", // クッキーを送信する設定
  });
}

import { getToken } from "@/app/lib/auth";

const buildHeaders = (extra: Record<string, string> = {}) => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
};
