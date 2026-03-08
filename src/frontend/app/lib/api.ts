import { getToken } from "./auth";
import type {
  Joke,
  JokeTopic,
  PaginatedResponse,
  VoteResponse,
  Category,
} from "../types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.100:8080/api";

// 共通のヘッダー生成
const jsonHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Accept: "application/json",
});

const authHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    ...jsonHeaders(),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// エラーハンドリング付きfetch
const fetchWithError = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// ========== ボケ関連API ==========

interface FetchJokesParams {
  page?: number;
  sort?: string;
  userId?: number;
}

interface JokesApiResponse {
  data: PaginatedResponse<Joke> | Joke[];
}

export const fetchJokes = async (
  params: FetchJokesParams = {}
): Promise<Joke[]> => {
  const { page = 1, sort = "latest", userId } = params;
  const searchParams = new URLSearchParams({
    page: page.toString(),
    sort,
  });
  if (userId) {
    searchParams.set("user_id", userId.toString());
  }

  const response = await fetchWithError<JokesApiResponse>(
    `${API_URL}/jokes?${searchParams}`,
    { headers: jsonHeaders() }
  );

  // APIレスポンスの形式に応じて適切にデータを取得
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if ("data" in response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return [];
};

interface JokesPaginatedResponse {
  data: PaginatedResponse<Joke>;
}

export const fetchJokesPaginated = async (
  params: FetchJokesParams = {}
): Promise<PaginatedResponse<Joke>> => {
  const { page = 1, sort = "latest", userId } = params;
  const searchParams = new URLSearchParams({
    page: page.toString(),
    sort,
  });
  if (userId) {
    searchParams.set("user_id", userId.toString());
  }

  const response = await fetchWithError<JokesPaginatedResponse>(
    `${API_URL}/jokes?${searchParams}`,
    { headers: jsonHeaders() }
  );

  return response.data;
};

export const voteJoke = async (jokeId: number): Promise<VoteResponse> => {
  return fetchWithError<VoteResponse>(`${API_URL}/jokes/${jokeId}/vote`, {
    method: "POST",
    headers: authHeaders(),
  });
};

interface CreateJokeParams {
  topic_id: number;
  content: string;
  categories?: string[];
}

export const createJoke = async (params: CreateJokeParams): Promise<Joke> => {
  const response = await fetchWithError<{ data: Joke }>(
    `${API_URL}/jokes/create`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(params),
    }
  );
  return response.data;
};

// ========== お題関連API ==========

interface TopicsApiResponse {
  data: PaginatedResponse<JokeTopic>;
}

export const fetchTopics = async (
  page: number = 1
): Promise<PaginatedResponse<JokeTopic>> => {
  const response = await fetchWithError<TopicsApiResponse>(
    `${API_URL}/joke-topics?page=${page}`,
    { headers: jsonHeaders() }
  );
  return response.data;
};

interface TopicDetailResponse {
  data: JokeTopic;
}

export const fetchTopic = async (id: number): Promise<JokeTopic> => {
  const response = await fetchWithError<TopicDetailResponse>(
    `${API_URL}/joke-topics/${id}`,
    { headers: jsonHeaders() }
  );
  return response.data;
};

export const createTopic = async (formData: FormData): Promise<JokeTopic> => {
  const token = getToken();
  const response = await fetch(`${API_URL}/joke-topics`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "お題の作成に失敗しました");
  }

  const result = await response.json();
  return result.data;
};

// ========== カテゴリ関連API ==========

interface CategoriesResponse {
  data: Category[];
}

export const fetchCategories = async (search?: string): Promise<Category[]> => {
  const url = search
    ? `${API_URL}/categories?search=${encodeURIComponent(search)}`
    : `${API_URL}/categories`;

  const response = await fetchWithError<CategoriesResponse>(url, {
    headers: jsonHeaders(),
  });
  return response.data;
};
