"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUser, getToken } from "@/app/lib/auth";
import MainLayout from "@/app/components/templates/MainLayout";
import {
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
} from "@mui/material";
import { Send, ArrowBack } from "@mui/icons-material";
import Link from "next/link";

interface JokeTopic {
  id: number;
  user_id: number;
  image_path: string;
  priority: number;
  created_at: string;
  updated_at: string;
  user: {
    username: string;
    avatar?: string;
  };
}

export default function JokeResponsePage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params?.id as string;

  const [topic, setTopic] = useState<JokeTopic | null>(null);
  const [jokeText, setJokeText] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ページ全体のローディング状態を計算
  const loading = dataLoading || authLoading;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getUser();
        if (response && response.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setIsLoggedIn(false);
      } finally {
        setAuthLoading(false);
      }
    };

    const fetchTopic = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.100:8080/api";
        const response = await fetch(`${API_URL}/joke-topics/${topicId}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("お題の取得に失敗しました");
        }

        const data = await response.json();
        setTopic(data.data);
      } catch (err) {
        console.error("Failed to fetch topic:", err);
        setError("お題の取得に失敗しました");
      } finally {
        setDataLoading(false);
      }
    };

    checkAuth();
    fetchTopic();
  }, [topicId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    if (!jokeText.trim()) {
      setError("ボケを入力してください");
      setSubmitting(false);
      return;
    }

    try {
      // APIエンドポイントのベースURL
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

      const response = await fetch(`${API_URL}/jokes/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({
          topic_id: topicId,
          content: jokeText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "ボケの投稿に失敗しました");
      }

      setSuccess(true);
      setJokeText("");

      // 成功後1.5秒後にボケ一覧ページに遷移
      setTimeout(() => {
        router.push("/jokes");
      }, 1500);
    } catch (err) {
      console.error("Failed to submit joke:", err);
      setError("ボケの投稿に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 8,
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            読み込み中...
          </Typography>
          <Button startIcon={<ArrowBack />} sx={{ mt: 4 }} disabled>
            <CircularProgress size={16} sx={{ mr: 1 }} />
            お題一覧に戻る
          </Button>
        </Box>
      </MainLayout>
    );
  }

  // お題が見つからない場合
  if (!topic) {
    return (
      <MainLayout>
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
            お題が見つかりませんでした
          </Alert>
          <Button
            component={Link}
            href="/joke_topic/list"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            お題一覧に戻る
          </Button>
        </Box>
      </MainLayout>
    );
  }

  // 非ログイン時の表示
  if (!isLoggedIn) {
    return (
      <MainLayout>
        <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
          <Card sx={{ mb: 4 }}>
            <CardMedia
              component="img"
              image={
                topic.image_path
                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${topic.image_path}`
                  : "https://placehold.co/600x400?text=No+Image"
              }
              alt="ボケお題画像"
              sx={{
                height: 300,
                objectFit: "contain",
                bgcolor: "grey.100",
              }}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                投稿者: {topic.user?.username || "不明"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                component="p"
              >
                {new Date(topic.created_at).toLocaleDateString("ja-JP")}
              </Typography>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 4,
              px: 2,
            }}
          >
            <Alert
              severity="warning"
              sx={{ width: "100%", maxWidth: 600, mb: 3 }}
            >
              ログインが必要です
            </Alert>
            <Typography variant="h6" gutterBottom textAlign="center">
              ボケを投稿するにはログインが必要です
            </Typography>
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                component={Link}
                href="/joke_topic/list"
                variant="outlined"
              >
                お題一覧に戻る
              </Button>
              <Button
                component={Link}
                href="/auth/login"
                variant="contained"
                color="primary"
              >
                ログイン画面へ
              </Button>
            </Box>
          </Box>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          このお題でボケる
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            image={
              topic.image_path
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${topic.image_path}`
                : "https://placehold.co/600x400?text=No+Image"
            }
            alt="ボケお題画像"
            sx={{
              height: 300,
              objectFit: "contain",
              bgcolor: "grey.100",
            }}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              投稿者: {topic.user?.username || "不明"}
            </Typography>
            <Typography variant="caption" color="text.secondary" component="p">
              {new Date(topic.created_at).toLocaleDateString("ja-JP")}
            </Typography>
          </CardContent>
        </Card>

        <Paper elevation={3} sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              ボケを投稿しました！お題一覧に戻ります...
            </Alert>
          )}

          <Typography variant="h6" gutterBottom>
            ボケを入力
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="あなたのボケ"
              value={jokeText}
              onChange={(e) => setJokeText(e.target.value)}
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              placeholder="この画像に対するボケを入力してください"
            />

            <Box
              sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                component={Link}
                href="/joke_topic/list"
                variant="outlined"
              >
                お題一覧に戻る
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting || !jokeText.trim()}
                startIcon={<Send />}
              >
                {submitting ? <CircularProgress size={24} /> : "ボケを投稿"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  );
}
