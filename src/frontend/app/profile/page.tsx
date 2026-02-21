"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/app/lib/auth";
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

const DEFAULT_ICON = "/images/robot-logo.png";

interface User {
  uid?: number;
  username: string;
  email: string;
  icon_url?: string;
  bio?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUser();
        if (response && response.user) {
          setUser(response.user);
        } else {
          // ユーザーデータがない場合はログインページにリダイレクト
          router.push("/auth/login");
        }
      } catch (err) {
        setError("プロフィール情報の取得に失敗しました");
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
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
            {error}
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
