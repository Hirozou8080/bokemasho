"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Skeleton,
} from "@mui/material";

export default function TopicCardSkeleton() {
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

      <CardContent sx={{ flexGrow: 1 }}>
        {/* 投稿者 */}
        <Skeleton variant="text" width={120} height={20} animation="wave" />
        {/* 日付 */}
        <Skeleton variant="text" width={80} height={18} animation="wave" />
      </CardContent>

      <CardActions>
        <Skeleton variant="text" width={100} height={30} animation="wave" />
      </CardActions>
    </Card>
  );
}
