"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/app/components/templates/MainLayout";
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Stack,
} from "@mui/material";
import { CloudUpload, AddCircle, ArrowBack } from "@mui/icons-material";
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

export default function JokeTopicListPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<JokeTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.100:8080/api";
        const response = await fetch(`${API_URL}/joke-topics`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("ボケお題の取得に失敗しました");
        }

        const data = await response.json();
        if (Array.isArray(data.data.data)) {
          setTopics(data.data.data);
        } else {
          console.error("API data is not an array:", data.data.data);
          setTopics([]);
          setError("データの形式が正しくありません");
        }
      } catch (err) {
        console.error("Failed to fetch topics:", err);
        setError("ボケお題の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

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
            お題を読み込み中...
          </Typography>
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBack />}
            sx={{ mt: 4 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                戻る
              </>
            ) : (
              "ホームに戻る"
            )}
          </Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            ボケお題一覧
          </Typography>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {topics.length === 0 && !error ? (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              まだボケお題がありません
            </Typography>
            <Typography variant="body1" paragraph>
              最初のボケお題を投稿してみませんか？
            </Typography>
            <Button
              component={Link}
              href="/joke_topic/create"
              variant="contained"
              color="primary"
              startIcon={<CloudUpload />}
            >
              お題を投稿
            </Button>
          </Paper>
        ) : (
          <Box sx={{ width: "100%" }}>
            <Stack spacing={3} direction="row" useFlexGap flexWrap="wrap">
              {Array.isArray(topics) && topics.length > 0 ? (
                topics.map((topic) => (
                  <Box
                    key={topic.id}
                    sx={{ width: { xs: "100%", sm: "45%", md: "30%" }, mb: 3 }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={
                          topic.image_path
                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${topic.image_path}`
                            : "https://placehold.co/600x400?text=No+Image"
                        }
                        alt="ボケお題画像"
                        sx={{
                          height: 200,
                          objectFit: "contain",
                          bgcolor: "grey.100",
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          投稿者: {topic.user?.username || "不明"}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="p"
                        >
                          {new Date(topic.created_at).toLocaleDateString(
                            "ja-JP"
                          )}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          component={Link}
                          href={`/joke_topic/${topic.id}`}
                        >
                          このお題でボケる
                        </Button>
                      </CardActions>
                    </Card>
                  </Box>
                ))
              ) : (
                <Box sx={{ width: "100%", textAlign: "center" }}>
                  <Typography align="center">お題がありません</Typography>
                </Box>
              )}
            </Stack>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}
