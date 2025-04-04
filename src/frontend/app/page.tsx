"use client";

import React from "react";
import MainLayout from "./components/templates/MainLayout";
import CardList from "./components/organisms/CardList";
import SearchField from "./components/molecules/SearchField";
import Typography from "./components/atoms/Typography";
import { Box } from "@mui/material";

export default function Home() {
  const items = [
    {
      id: 1,
      title: "本日の厳選ボケ",
      description:
        "「いつも寝る前に何を数えますか？」「羊ではなく、昨日の恥ずかしい記憶です」",
      imageUrl: "https://picsum.photos/300/200?random=1",
      buttonText: "もっと見る",
    },
    {
      id: 2,
      title: "人気ボケランキング",
      description:
        "「砂漠で遭難したらどうする？」「とりあえず『サッ』と立ち上がって『ラッ』と砂を払い、『サハラ』へ行く」",
      imageUrl: "https://picsum.photos/300/200?random=2",
      buttonText: "ランキングを見る",
    },
    {
      id: 3,
      title: "ボケ投稿コーナー",
      description:
        "あなたの面白いボケを投稿してみませんか？審査員が選んだ秀逸なボケは毎週紹介されます！",
      imageUrl: "https://picsum.photos/300/200?random=3",
      buttonText: "投稿する",
    },
  ];

  const handleCardClick = (id: string | number) => {
    console.log(`Card ${id} clicked`);
  };

  const handleSearch = (value: string) => {
    console.log(`Search: ${value}`);
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          笑いの神殿へようこそ
        </Typography>
        <Typography variant="body1" paragraph>
          世界一面白いボケを集めた「ボケ魔性」へようこそ。あなたの笑いのツボを刺激する魔性のコンテンツをお楽しみください。
        </Typography>
        <Box sx={{ mb: 3, maxWidth: 500 }}>
          <SearchField onChange={handleSearch} />
        </Box>
      </Box>
      <CardList items={items} onCardClick={handleCardClick} />
    </MainLayout>
  );
}
