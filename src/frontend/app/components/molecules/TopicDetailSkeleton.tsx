"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Paper,
  Skeleton,
  Divider,
} from "@mui/material";

export default function TopicDetailSkeleton() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      {/* タイトル */}
      <Skeleton
        variant="text"
        width={200}
        height={40}
        sx={{ mb: 2 }}
        animation="wave"
      />

      {/* お題カード */}
      <Card sx={{ mb: 4 }}>
        <Skeleton
          variant="rectangular"
          height={300}
          animation="wave"
          sx={{ bgcolor: "grey.100" }}
        />
        <CardContent>
          <Skeleton variant="text" width={120} height={24} animation="wave" />
          <Skeleton variant="text" width={80} height={20} animation="wave" />
        </CardContent>
      </Card>

      {/* 投稿フォーム */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Skeleton
          variant="text"
          width={100}
          height={32}
          sx={{ mb: 1 }}
          animation="wave"
        />
        <Divider sx={{ mb: 3 }} />

        {/* テキストフィールド */}
        <Skeleton
          variant="rectangular"
          height={56}
          sx={{ borderRadius: 1, mb: 2 }}
          animation="wave"
        />

        {/* カテゴリフィールド */}
        <Skeleton
          variant="rectangular"
          height={56}
          sx={{ borderRadius: 1, mb: 3 }}
          animation="wave"
        />

        {/* ボタン */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton
            variant="rectangular"
            width={140}
            height={36}
            sx={{ borderRadius: 1 }}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            width={120}
            height={36}
            sx={{ borderRadius: 1 }}
            animation="wave"
          />
        </Box>
      </Paper>
    </Box>
  );
}
