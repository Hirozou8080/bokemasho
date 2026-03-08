"use client";

import React, { useState } from "react";
import MainLayout from "./components/templates/MainLayout";
import Typography from "./components/atoms/Typography";
import { Box, Button } from "@mui/material";
import { EmojiEmotions, ArrowForward } from "@mui/icons-material";
import Link from "next/link";
import JokeCard from "./components/molecules/JokeCard";
import JokeCardSkeleton from "./components/molecules/JokeCardSkeleton";
import TopicCard from "./components/molecules/TopicCard";
import TopicCardSkeleton from "./components/molecules/TopicCardSkeleton";
import LoginRequiredDialog from "./components/molecules/LoginRequiredDialog";
import CardGrid from "./components/organisms/CardGrid";
import { useUser } from "./hooks/useAuth";
import { useJokes, useVoteJoke } from "./hooks/useJokes";
import { useTopics } from "./hooks/useTopics";

export default function Home() {
  const [openModal, setOpenModal] = useState(false);

  // React Query フック
  const { data: user } = useUser();
  const { data: jokes = [], isLoading: jokesLoading, error: jokesError } = useJokes(user?.id);
  const { data: topicsData, isLoading: topicsLoading, error: topicsError } = useTopics();
  const voteMutation = useVoteJoke();

  const topics = topicsData?.data ?? [];

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
            sx={{ fontWeight: 600 }}
          >
            すべて見る
          </Button>
        </Box>

        <CardGrid
          items={jokes.slice(0, 6)}
          loading={jokesLoading}
          error={jokesError?.message || ""}
          emptyMessage="まだボケがありません"
          skeletonCount={6}
          renderItem={(joke) => <JokeCard joke={joke} onVote={handleVote} />}
          renderSkeleton={() => <JokeCardSkeleton />}
        />
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
            sx={{ fontWeight: 600 }}
          >
            すべて見る
          </Button>
        </Box>

        <CardGrid
          items={topics.slice(0, 3)}
          loading={topicsLoading}
          error={topicsError?.message || ""}
          emptyMessage="まだボケお題がありません"
          skeletonCount={3}
          renderItem={(topic) => <TopicCard topic={topic} />}
          renderSkeleton={() => <TopicCardSkeleton />}
          columns={{ xs: "100%", sm: "48%", md: "30%" }}
        />
      </Box>
      <LoginRequiredDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        message="グッドを押すにはログインをしてください。"
      />
    </MainLayout>
  );
}
