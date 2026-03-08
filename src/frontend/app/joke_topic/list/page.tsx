"use client";

import MainLayout from "@/app/components/templates/MainLayout";
import { Box, Typography } from "@mui/material";
import TopicCard from "@/app/components/molecules/TopicCard";
import TopicCardSkeleton from "@/app/components/molecules/TopicCardSkeleton";
import CardGrid from "@/app/components/organisms/CardGrid";
import { useTopics } from "@/app/hooks/useTopics";

export default function JokeTopicListPage() {
  const { data, isLoading, error } = useTopics();

  const topics = data?.data ?? [];
  const errorMessage = error ? "ボケお題の取得に失敗しました" : "";

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

        <CardGrid
          items={topics}
          loading={isLoading}
          error={errorMessage}
          emptyMessage="まだボケお題がありません"
          skeletonCount={6}
          renderItem={(topic) => <TopicCard topic={topic} />}
          renderSkeleton={() => <TopicCardSkeleton />}
          columns={{ xs: "100%", sm: "45%", md: "30%" }}
        />
      </Box>
    </MainLayout>
  );
}
