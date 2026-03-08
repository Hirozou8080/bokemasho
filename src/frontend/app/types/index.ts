// ユーザー関連
export interface User {
  id: number;
  username: string;
  email?: string;
  bio?: string;
  icon_url?: string;
}

// カテゴリ
export interface Category {
  id: number;
  name: string;
}

// ボケ
export interface Joke {
  id: number;
  content: string;
  votes_count: number;
  created_at: string;
  has_voted: boolean;
  user: {
    username: string;
    icon_url?: string;
  };
  topic: {
    id: number;
    image_path: string;
  };
  categories?: Category[];
}

// ボケお題
export interface JokeTopic {
  id: number;
  user_id: number;
  image_path: string;
  priority: number;
  created_at: string;
  updated_at: string;
  jokes?: Joke[];
  categories?: Category[];
  user: {
    username: string;
    icon_url?: string;
  };
}

// ページネーション
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// 投票レスポンス
export interface VoteResponse {
  vote_count: number;
  has_voted: boolean;
}

// ソート種別
export type SortType = "latest" | "popular";
