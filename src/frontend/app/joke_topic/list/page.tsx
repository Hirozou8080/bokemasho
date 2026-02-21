"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/app/components/templates/MainLayout";
import { Box, Typography } from "@mui/material";
import TopicCard from "@/app/components/molecules/TopicCard";
import TopicCardSkeleton from "@/app/components/molecules/TopicCardSkeleton";
import CardGrid from "@/app/components/organisms/CardGrid";

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
          loading={loading}
          error={error}
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
