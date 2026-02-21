"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "../components/templates/MainLayout";
import Typography from "../components/atoms/Typography";
import {
  Box,
  Button,
  Pagination,
  Fab,
  Tabs,
  Tab,
} from "@mui/material";
import { ArrowBack, EmojiEmotions, TrendingUp, Schedule, EmojiEvents } from "@mui/icons-material";
import Link from "next/link";
import { getToken, getUserData } from "@/app/lib/auth";
import JokeCard from "../components/molecules/JokeCard";
import JokeCardSkeleton from "../components/molecules/JokeCardSkeleton";
import LoginRequiredDialog from "../components/molecules/LoginRequiredDialog";
import CardGrid from "../components/organisms/CardGrid";

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

type SortType = "latest" | "popular" | "ranking";

export default function JokesPage() {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [userInitialized, setUserInitialized] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [sortType, setSortType] = useState<SortType>("latest");

  // クライアントサイドでユーザー情報を取得
  useEffect(() => {
    const cachedUser = getUserData();
    setUser(cachedUser);
    setUserInitialized(true);
  }, []);

  // ボケ一覧を取得（ユーザー情報取得後）
  useEffect(() => {
    if (!userInitialized) return;
    const fetchJokes = async () => {
      try {
        setLoading(true);
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.100:8080/api";
        const params = new URLSearchParams({
          page: page.toString(),
          sort: sortType,
        });
        if (user?.id) {
          params.append("user_id", user.id.toString());
        }
        const response = await fetch(
          `${API_URL}/jokes?${params.toString()}`,
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

        const data = await response.json();

        if (data.data && data.data.data) {
          setJokes(data.data.data);
          setTotalPages(data.data.last_page || 1);
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
  }, [page, sortType, userInitialized, user]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (event: React.SyntheticEvent, newValue: SortType) => {
    setSortType(newValue);
    setPage(1); // ソート変更時はページを1に戻す
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

        <Box sx={{ mb: 3 }}>
          <Tabs
            value={sortType}
            onChange={handleSortChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab
              value="latest"
              label="新着"
              icon={<Schedule />}
              iconPosition="start"
              sx={{ fontWeight: 600 }}
            />
            <Tab
              value="popular"
              label="人気"
              icon={<TrendingUp />}
              iconPosition="start"
              sx={{ fontWeight: 600 }}
            />
            <Tab
              value="ranking"
              label="ランキング"
              icon={<EmojiEvents />}
              iconPosition="start"
              sx={{ fontWeight: 600 }}
            />
          </Tabs>
        </Box>

        <CardGrid
          items={jokes}
          loading={loading}
          error={error}
          emptyMessage="まだボケがありません"
          skeletonCount={6}
          renderItem={(joke) => (
            <JokeCard joke={joke} onVote={handleVote} actionLabel="このお題でボケる" />
          )}
          renderSkeleton={() => <JokeCardSkeleton />}
        />

        {!loading && !error && jokes.length > 0 && (
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

      <LoginRequiredDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        message="グッドを押すにはログインをしてください。"
      />
    </MainLayout>
  );
}
