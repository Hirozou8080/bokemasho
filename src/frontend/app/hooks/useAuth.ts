"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUser as getUserApi,
  login as loginApi,
  logout as logoutApi,
  updateProfile as updateProfileApi,
  getToken,
} from "../lib/auth";
import type { User } from "../types";

// ユーザー情報を取得
export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await getUserApi();
      return response?.user as User | null;
    },
    staleTime: 5 * 60 * 1000, // 5分
    enabled: !!getToken(), // トークンがある場合のみ実行
  });
};

// ログイン
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(["user"], data.user);
      }
    },
  });
};

// ログアウト
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries();
    },
  });
};

// プロフィール更新
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: { username?: string; bio?: string; icon?: File }) =>
      updateProfileApi(userData),
    onSuccess: (data) => {
      if (data.data) {
        queryClient.setQueryData(["user"], data.data);
      }
    },
  });
};

// ログイン状態を確認するユーティリティ
export const useIsLoggedIn = () => {
  const { data: user, isLoading } = useUser();
  return {
    isLoggedIn: !!user,
    isLoading,
    user,
  };
};
