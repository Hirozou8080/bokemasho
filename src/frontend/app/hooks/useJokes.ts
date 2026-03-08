"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchJokes,
  fetchJokesPaginated,
  voteJoke,
  createJoke,
} from "../lib/api";
import type { Joke, PaginatedResponse, SortType } from "../types";

// ボケ一覧を取得（シンプル版）
export const useJokes = (userId?: number) => {
  return useQuery({
    queryKey: ["jokes", { userId }],
    queryFn: () => fetchJokes({ userId }),
  });
};

// ボケ一覧を取得（ページネーション付き）
export const useJokesPaginated = (page: number, sort: SortType, userId?: number) => {
  return useQuery({
    queryKey: ["jokes", { page, sort, userId }],
    queryFn: () => fetchJokesPaginated({ page, sort, userId }),
  });
};

// ボケへの投票
export const useVoteJoke = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voteJoke,
    onMutate: async (jokeId) => {
      // 楽観的更新のために現在のデータをキャンセル
      await queryClient.cancelQueries({ queryKey: ["jokes"] });
      return { jokeId };
    },
    onSuccess: (data, jokeId) => {
      // キャッシュ内のボケを更新
      queryClient.setQueriesData<Joke[]>(
        { queryKey: ["jokes"] },
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((joke) =>
            joke.id === jokeId
              ? { ...joke, votes_count: data.vote_count, has_voted: data.has_voted }
              : joke
          );
        }
      );
      // ページネーション付きのキャッシュも更新
      queryClient.setQueriesData<PaginatedResponse<Joke>>(
        { queryKey: ["jokes"] },
        (oldData) => {
          if (!oldData || !("data" in oldData)) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((joke) =>
              joke.id === jokeId
                ? { ...joke, votes_count: data.vote_count, has_voted: data.has_voted }
                : joke
            ),
          };
        }
      );
    },
    onError: () => {
      // エラー時はキャッシュを再取得
      queryClient.invalidateQueries({ queryKey: ["jokes"] });
    },
  });
};

// ボケを作成
export const useCreateJoke = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJoke,
    onSuccess: () => {
      // ボケ一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ["jokes"] });
      // お題詳細のキャッシュも無効化（ボケ数などが変わるため）
      queryClient.invalidateQueries({ queryKey: ["topic"] });
    },
  });
};
