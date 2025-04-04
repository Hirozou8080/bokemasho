"use client";

import React from "react";
import Card from "../molecules/Card";
import Box from "../atoms/Box";

interface CardItem {
  id: string | number;
  title: string;
  description: string;
  imageUrl?: string;
  buttonText?: string;
}

interface CardListProps {
  items: CardItem[];
  onCardClick?: (id: string | number) => void;
}

const CardList: React.FC<CardListProps> = ({ items, onCardClick }) => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
      {items.map((item) => (
        <Box key={item.id} sx={{ width: { xs: "100%", sm: "45%", md: "30%" } }}>
          <Card
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            buttonText={item.buttonText}
            onButtonClick={() => onCardClick && onCardClick(item.id)}
          />
        </Box>
      ))}
    </Box>
  );
};

export default CardList;
