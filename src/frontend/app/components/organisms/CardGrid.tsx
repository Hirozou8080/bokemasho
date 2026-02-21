"use client";

import React from "react";
import { Box, Stack, Paper, Typography } from "@mui/material";

interface CardGridProps<T> {
  items: T[];
  loading: boolean;
  error?: string;
  emptyMessage?: string;
  skeletonCount?: number;
  renderItem: (item: T) => React.ReactNode;
  renderSkeleton: () => React.ReactNode;
  columns?: {
    xs: string;
    sm: string;
    md: string;
  };
}

export default function CardGrid<T extends { id: number | string }>({
  items,
  loading,
  error,
  emptyMessage = "データがありません",
  skeletonCount = 6,
  renderItem,
  renderSkeleton,
  columns = { xs: "100%", sm: "48%", md: "31%" },
}: CardGridProps<T>) {
  if (loading) {
    return (
      <Stack direction="row" spacing={3} useFlexGap flexWrap="wrap">
        {[...Array(skeletonCount)].map((_, index) => (
          <Box
            key={index}
            sx={{ width: { xs: columns.xs, sm: columns.sm, md: columns.md }, mb: 3 }}
          >
            {renderSkeleton()}
          </Box>
        ))}
      </Stack>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: "center", mb: 3 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  if (items.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center", mb: 3 }}>
        <Typography>{emptyMessage}</Typography>
      </Paper>
    );
  }

  return (
    <Stack direction="row" spacing={3} useFlexGap flexWrap="wrap">
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{ width: { xs: columns.xs, sm: columns.sm, md: columns.md }, mb: 3 }}
        >
          {renderItem(item)}
        </Box>
      ))}
    </Stack>
  );
}
