"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "./components/templates/MainLayout";
import Typography from "./components/atoms/Typography";
import { getUser, getToken } from "@/app/lib/auth";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Paper,
  Divider,
  CardMedia,
} from "@mui/material";
import { EmojiEmotions, ArrowForward, ThumbUp } from "@mui/icons-material";
import Link from "next/link";

interface Joke {
  id: number;
  content: string;
  votes_count: number;
  created_at: string;
  has_voted: boolean;
  user: {
    username: string;
    avatar?: string;
  };
  topic: {
    id: number;
    image_path: string;
  };
}

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

interface User {
  id: number;
  username: string;
}

export default function Home() {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [topics, setTopics] = useState<JokeTopic[]>([]);
  const [jokesLoading, setJokesLoading] = useState(true);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [jokesError, setJokesError] = useState("");
  const [topicsError, setTopicsError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUser();
      if (response && response.user) {
        setUser(response.user);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchJokes = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.100:8080/api";
        const url = user
          ? `${API_URL}/jokes?user_id=${user.id}`
          : `${API_URL}/jokes`;
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("ボケの取得に失敗しました");
        }

        const responseText = await response.text();
        let data;

        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("JSON parse error:", parseError, responseText);
          throw new Error("レスポンスの解析に失敗しました");
        }

        if (Array.isArray(data.data.data)) {
          setJokes(data.data.data);
        } else if (Array.isArray(data.data)) {
          setJokes(data.data);
        } else {
          console.error("API data is not an array:", data);
          setJokes([]);
        }
      } catch (err) {
        console.error("Failed to fetch jokes:", err);
        setJokesError(
          err instanceof Error ? err.message : "ボケの取得に失敗しました"
        );
      } finally {
        setJokesLoading(false);
      }
    };

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

        const responseText = await response.text();
        let data;

        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("JSON parse error:", parseError, responseText);
          throw new Error("レスポンスの解析に失敗しました");
        }

        if (Array.isArray(data.data.data)) {
          setTopics(data.data.data);
        } else {
          console.error("API data is not an array:", data.data.data);
          setTopics([]);
          setTopicsError("データの形式が正しくありません");
        }
      } catch (err) {
        console.error("Failed to fetch topics:", err);
        setTopicsError(
          err instanceof Error ? err.message : "ボケお題の取得に失敗しました"
        );
      } finally {
        setTopicsLoading(false);
      }
    };

    fetchJokes();
    fetchTopics();
  }, [user]);

  // 投票処理
  const handleVote = async (jokeId: number) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.100:8080/api";

      const response = await fetch(`${API_URL}/jokes/${jokeId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("投票に失敗しました");
      }

      const data = await response.json();

      // 投票状態を更新
      setJokes((prevJokes) =>
        prevJokes.map((joke) =>
          joke.id === jokeId
            ? {
                ...joke,
                votes_count: data.vote_count,
                has_voted: data.has_voted,
              }
            : joke
        )
      );
    } catch (err) {
      console.error("Failed to vote:", err);
      alert(err instanceof Error ? err.message : "投票に失敗しました");
    }
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            笑いの神殿へようこそ
          </Typography>
          <Button
            component={Link}
            href="/joke_topic/list"
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<EmojiEmotions />}
            sx={{
              fontWeight: "bold",
              borderRadius: "28px",
              px: { xs: 2, sm: 3 },
              py: { xs: 0.5, sm: 1 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
              minWidth: { xs: "120px", sm: "auto" },
              height: { xs: "40px", sm: "48px" },
              "& .MuiButton-startIcon": {
                marginRight: { xs: 0.5, sm: 1 },
              },
            }}
          >
            ボケる
          </Button>
        </Box>
        <Typography variant="body1" paragraph>
          世界一面白いボケを集めた「ボケ魔性」へようこそ。あなたの笑いのツボを刺激する魔性のコンテンツをお楽しみください。
        </Typography>
      </Box>

      <Box sx={{ mt: 6, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" component="h2">
            最新のボケ一覧
          </Typography>
          <Button
            component={Link}
            href="/jokes"
            endIcon={<ArrowForward />}
            color="primary"
          >
            すべて見る
          </Button>
        </Box>

        {jokesLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
            <CircularProgress />
          </Box>
        ) : jokesError ? (
          <Paper sx={{ p: 3, textAlign: "center", mb: 3 }}>
            <Typography color="error">{jokesError}</Typography>
          </Paper>
        ) : jokes.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center", mb: 3 }}>
            <Typography>まだボケがありません</Typography>
          </Paper>
        ) : (
          <Stack direction="row" spacing={3} useFlexGap flexWrap="wrap">
            {jokes.slice(0, 6).map((joke) => (
              <Box
                key={joke.id}
                sx={{ width: { xs: "100%", sm: "48%", md: "31%" }, mb: 3 }}
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
                      joke.topic.image_path
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${joke.topic.image_path}`
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
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        src={joke.user.avatar}
                        alt={joke.user.username}
                        sx={{ mr: 1, width: 32, height: 32 }}
                      />
                      <Typography variant="subtitle2">
                        {joke.user.username}
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {joke.content}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {new Date(joke.created_at).toLocaleDateString("ja-JP")}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Button
                          onClick={() => handleVote(joke.id)}
                          sx={{
                            minWidth: "auto",
                            p: 0.5,
                            color: joke.has_voted
                              ? "primary.main"
                              : "text.secondary",
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          <ThumbUp
                            fontSize="small"
                            color={joke.has_voted ? "primary" : "inherit"}
                            sx={{ mr: 0.5 }}
                          />
                        </Button>
                        <Typography variant="body2" color="primary">
                          {joke.votes_count || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button
                      size="small"
                      component={Link}
                      href={`/joke_topic/${joke.topic.id}`}
                    >
                      お題を見る
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <Box sx={{ mt: 6, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" component="h2">
            人気ボケお題
          </Typography>
          <Button
            component={Link}
            href="/joke_topic/list"
            endIcon={<ArrowForward />}
            color="primary"
          >
            すべて見る
          </Button>
        </Box>

        {topicsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
            <CircularProgress />
          </Box>
        ) : topicsError ? (
          <Paper sx={{ p: 3, textAlign: "center", mb: 3 }}>
            <Typography color="error">{topicsError}</Typography>
          </Paper>
        ) : topics.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center", mb: 3 }}>
            <Typography>まだボケお題がありません</Typography>
          </Paper>
        ) : (
          <Stack spacing={3} direction="row" useFlexGap flexWrap="wrap">
            {topics.slice(0, 3).map((topic) => (
              <Box
                key={topic.id}
                sx={{ width: { xs: "100%", sm: "48%", md: "30%" }, mb: 3 }}
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
                      {new Date(topic.created_at).toLocaleDateString("ja-JP")}
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
            ))}
          </Stack>
        )}
      </Box>
    </MainLayout>
  );
}
