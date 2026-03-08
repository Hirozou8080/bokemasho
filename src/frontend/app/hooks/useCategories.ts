"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../lib/api";

// カテゴリを検索
export const useCategories = (search?: string) => {
  return useQuery({
    queryKey: ["categories", { search }],
    queryFn: () => fetchCategories(search),
    enabled: search === undefined || search.length > 0, // 空文字の時は実行しない
    staleTime: 5 * 60 * 1000, // 5分
  });
};
