"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "../components/templates/MainLayout";
import Typography from "../components/atoms/Typography";
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
  Pagination,
  Fab,
} from "@mui/material";
import { ThumbUp, ArrowBack, EmojiEmotions } from "@mui/icons-material";
import Link from "next/link";
import { getUser, getToken } from "@/app/lib/auth";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useRouter } from "next/navigation";

interface Joke {
  id: number;
  content: string;
  votes: number;
  has_voted: boolean;
  votes_count: number;
  created_at: string;
  user: {
    username: string;
    avatar?: string;
  };
  topic: {
    id: number;
    image_path: string;
  };
}

interface User {
  id: number;
}

export default function JokesPage() {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

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
        setLoading(true);
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.100:8080/api";
        const response = await fetch(
          user
            ? `${API_URL}/jokes?page=${page}&user_id=${user.id}`
            : `${API_URL}/jokes?page=${page}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("ボケの取得に失敗しました");
        }

        // レスポンスをテキストとして取得し、JSON構文解析エラーに備える
        const responseText = await response.text();
        let data;

        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("JSON parse error:", parseError, responseText);
          throw new Error("レスポンスの解析に失敗しました");
        }

        if (data.data && data.data.data) {
          setJokes(data.data.data);
          setTotalPages(data.data.last_page || 1);
          console.log("Pagination info:", {
            currentPage: data.data.current_page,
            lastPage: data.data.last_page,
            total: data.data.total,
            perPage: data.data.per_page
          });
        } else if (data.data) {
          setJokes(data.data);
          setTotalPages(1);
        } else {
          console.error("API data format is not as expected:", data);
          setJokes([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Failed to fetch jokes:", err);
        setError(
          err instanceof Error ? err.message : "ボケの取得に失敗しました"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJokes();
  }, [page, user]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  // 投票処理
  const handleVote = async (jokeId: number) => {
    if (!user) {
      setOpenModal(true);
      return;
    }
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
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            ボケ一覧
          </Typography>
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBack />}
            variant="outlined"
          >
            ホームに戻る
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8, mb: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 3, textAlign: "center", mb: 3 }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        ) : jokes.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center", mb: 3 }}>
            <Typography>まだボケがありません</Typography>
          </Paper>
        ) : (
          <>
            <Stack direction="row" spacing={3} useFlexGap flexWrap="wrap">
              {jokes.map((joke) => (
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
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
                          {new Date(joke.created_at).toLocaleDateString(
                            "ja-JP"
                          )}
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
                        このお題でボケる
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Stack>

            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        )}
      </Box>

      {/* 右下に固定表示される「ボケる」ボタン */}
      <Fab
        component={Link}
        href="/joke_topic/list"
        color="secondary"
        variant="extended"
        aria-label="ボケる"
        sx={{
          position: "fixed",
          bottom: 100,
          right: 20,
          zIndex: 1000,
          fontWeight: "bold",
          px: 2,
        }}
      >
        <EmojiEmotions sx={{ mr: 1 }} />
        ボケる
      </Fab>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>ログインが必要です</DialogTitle>
        <DialogContent>グッドを押すにはログインをしてください。</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>閉じる</Button>
          <Button
            onClick={() => {
              setOpenModal(false);
              router.push("/auth/login");
            }}
            color="primary"
            variant="contained"
          >
            ログインページへ
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
