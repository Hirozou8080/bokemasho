"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTopics, fetchTopic, createTopic } from "../lib/api";

// お題一覧を取得
export const useTopics = (page: number = 1) => {
  return useQuery({
    queryKey: ["topics", { page }],
    queryFn: () => fetchTopics(page),
  });
};

// お題詳細を取得
export const useTopic = (id: number) => {
  return useQuery({
    queryKey: ["topic", id],
    queryFn: () => fetchTopic(id),
    enabled: !!id,
  });
};

// お題を作成
export const useCreateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTopic,
    onSuccess: () => {
      // お題一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });
};
