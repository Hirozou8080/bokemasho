"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "../components/templates/MainLayout";
import Typography from "../components/atoms/Typography";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Paper,
  Pagination,
  Fab,
} from "@mui/material";
import { ArrowBack, EmojiEmotions } from "@mui/icons-material";
import Link from "next/link";
import { getUser, getToken } from "@/app/lib/auth";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useRouter } from "next/navigation";
import JokeCard from "../components/molecules/JokeCard";

interface Category {
  id: number;
  name: string;
}

interface Joke {
  id: number;
  content: string;
  votes: number;
  has_voted: boolean;
  votes_count: number;
  created_at: string;
  user: {
    username: string;
    icon_url?: string;
  };
  topic: {
    id: number;
    image_path: string;
  };
  categories?: Category[];
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
                  <JokeCard joke={joke} onVote={handleVote} actionLabel="このお題でボケる" />
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
