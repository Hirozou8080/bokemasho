"use client";

import React, { useState } from "react";
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
import JokeCard from "../components/molecules/JokeCard";
import JokeCardSkeleton from "../components/molecules/JokeCardSkeleton";
import LoginRequiredDialog from "../components/molecules/LoginRequiredDialog";
import CardGrid from "../components/organisms/CardGrid";
import { useUser } from "../hooks/useAuth";
import { useJokesPaginated, useVoteJoke } from "../hooks/useJokes";
import type { SortType } from "../types";

type ExtendedSortType = SortType | "ranking";

export default function JokesPage() {
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [sortType, setSortType] = useState<ExtendedSortType>("latest");

  // React Query フック
  const { data: user } = useUser();
  const { data: jokesData, isLoading: loading, error } = useJokesPaginated(
    page,
    sortType === "ranking" ? "popular" : sortType,
    user?.id
  );
  const voteMutation = useVoteJoke();

  const jokes = jokesData?.data ?? [];
  const totalPages = jokesData?.last_page ?? 1;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (event: React.SyntheticEvent, newValue: ExtendedSortType) => {
    setSortType(newValue);
    setPage(1);
  };

  // 投票処理
  const handleVote = (jokeId: number) => {
    if (!user) {
      setOpenModal(true);
      return;
    }
    voteMutation.mutate(jokeId, {
      onError: (err) => {
        alert(err instanceof Error ? err.message : "投票に失敗しました");
      },
    });
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
          error={error?.message || ""}
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
