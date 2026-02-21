"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import Link from "next/link";

interface TopicCardProps {
  topic: {
    id: number;
    image_path: string;
    created_at: string;
    user: {
      username: string;
    };
  };
}

export default function TopicCard({ topic }: TopicCardProps) {
  return (
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
          topic.image_path
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${topic.image_path}`
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
        <Typography variant="body2" color="text.secondary">
          投稿者: {topic.user?.username || "不明"}
        </Typography>
        <Typography variant="caption" color="text.secondary" component="p">
          {new Date(topic.created_at).toLocaleDateString("ja-JP")}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          sx={{ fontWeight: 600 }}
          component={Link}
          href={`/joke_topic/${topic.id}`}
        >
          このお題でボケる
        </Button>
      </CardActions>
    </Card>
  );
}
