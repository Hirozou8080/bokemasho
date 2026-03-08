"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/app/components/templates/MainLayout";
import {
  Box,
  Paper,
  Avatar,
  CircularProgress,
  Button,
  Divider,
} from "@mui/material";
import Typography from "@/app/components/atoms/Typography";
import { useUser } from "@/app/hooks/useAuth";

const DEFAULT_ICON = "/images/robot-logo.png";

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, isLoading, error } = useUser();

  // 未ログインの場合はログインページにリダイレクト
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <MainLayout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            プロフィール情報の取得に失敗しました
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/auth/login")}
            sx={{ mt: 2 }}
          >
            ログインする
          </Button>
        </Box>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6">
            ユーザー情報が見つかりません。ログインしてください。
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/auth/login")}
            sx={{ mt: 2 }}
          >
            ログインする
          </Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          プロフィール
        </Typography>

        <Paper elevation={3} sx={{ width: "100%", maxWidth: 600, p: 4, mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Avatar
              src={user.icon_url || DEFAULT_ICON}
              alt={user.username}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {user.username}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              自己紹介
            </Typography>
            <Typography variant="body1" paragraph>
              {user.bio || "まだ自己紹介はありません。"}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => router.push("/profile/edit")}
          >
            プロフィールを編集
          </Button>
        </Paper>
      </Box>
    </MainLayout>
  );
}
