"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  Typography,
  Box,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import { ThumbUp } from "@mui/icons-material";
import Link from "next/link";

const DEFAULT_ICON = "/images/robot-logo.png";

interface Category {
  id: number;
  name: string;
}

interface JokeCardProps {
  joke: {
    id: number;
    content: string;
    votes_count: number;
    created_at: string;
    has_voted: boolean;
    user: {
      username: string;
      icon_url?: string;
    };
    topic: {
      id: number;
      image_path: string;
    };
    categories?: Category[];
  };
  onVote: (jokeId: number) => void;
  actionLabel?: string;
}

export default function JokeCard({ joke, onVote, actionLabel = "このお題でボケる" }: JokeCardProps) {
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
          joke.topic.image_path
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${joke.topic.image_path}`
            : "https://placehold.co/600x400?text=No+Image"
        }
        alt="ボケお題画像"
        sx={{
          height: 200,
          objectFit: "contain",
          bgcolor: "grey.100",
        }}
      />
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={joke.user.icon_url || DEFAULT_ICON}
            alt={joke.user.username}
            sx={{ mr: 1, width: 32, height: 32 }}
          />
          <Typography variant="subtitle2">{joke.user.username}</Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{
            mb: 2,
            minHeight: 72,
            textAlign: "center",
            fontWeight: 600,
            fontSize: "1.1rem",
            flexGrow: 1,
          }}
        >
          {joke.content}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            mb: 1,
            minHeight: 20,
          }}
        >
          {joke.categories &&
            joke.categories.length > 0 &&
            joke.categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                size="small"
                sx={{
                  borderRadius: 1,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              />
            ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {new Date(joke.created_at).toLocaleDateString("ja-JP")}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mr: -0.5 }}>
            <Button
              onClick={() => onVote(joke.id)}
              sx={{
                minWidth: 36,
                minHeight: 36,
                p: 0.5,
                color: joke.has_voted ? "primary.main" : "text.secondary",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ThumbUp
                sx={{ fontSize: 22 }}
                color={joke.has_voted ? "primary" : "inherit"}
              />
            </Button>
            <Typography variant="body2" color="primary" fontWeight={600} sx={{ minWidth: 16 }}>
              {joke.votes_count || 0}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button size="small" color="primary" sx={{ fontWeight: 600 }} component={Link} href={`/joke_topic/${joke.topic.id}`}>
          {actionLabel}
        </Button>
      </CardActions>
    </Card>
  );
}
