"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Divider,
  Skeleton,
} from "@mui/material";

export default function JokeCardSkeleton() {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 画像部分 */}
      <Skeleton
        variant="rectangular"
        height={200}
        sx={{ bgcolor: "grey.200" }}
        animation="wave"
      />

      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* ユーザー情報 */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Skeleton
            variant="circular"
            width={32}
            height={32}
            sx={{ mr: 1 }}
            animation="wave"
          />
          <Skeleton variant="text" width={80} height={24} animation="wave" />
        </Box>

        {/* ボケ内容 */}
        <Box sx={{ mb: 2, minHeight: 72, flexGrow: 1 }}>
          <Skeleton variant="text" width="100%" height={24} animation="wave" />
          <Skeleton variant="text" width="80%" height={24} animation="wave" />
          <Skeleton variant="text" width="60%" height={24} animation="wave" />
        </Box>

        {/* カテゴリタグ */}
        <Box sx={{ display: "flex", gap: 0.5, mb: 1, minHeight: 20 }}>
          <Skeleton
            variant="rounded"
            width={50}
            height={20}
            sx={{ borderRadius: 1 }}
            animation="wave"
          />
          <Skeleton
            variant="rounded"
            width={40}
            height={20}
            sx={{ borderRadius: 1 }}
            animation="wave"
          />
        </Box>

        {/* 日付といいね */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Skeleton variant="text" width={80} height={20} animation="wave" />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Skeleton
              variant="circular"
              width={22}
              height={22}
              sx={{ mr: 0.5 }}
              animation="wave"
            />
            <Skeleton variant="text" width={16} height={20} animation="wave" />
          </Box>
        </Box>
      </CardContent>

      <Divider />

      <CardActions>
        <Skeleton variant="text" width={100} height={30} animation="wave" />
      </CardActions>
    </Card>
  );
}
