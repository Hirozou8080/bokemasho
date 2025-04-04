"use client";
import React from "react";
import {
  Card as MuiCard,
  CardContent,
  CardActions,
  CardMedia,
} from "@mui/material";
import Typography from "../atoms/Typography";
import Button from "../atoms/Button";

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  onButtonClick,
}) => {
  return (
    <MuiCard sx={{ maxWidth: 345 }}>
      {imageUrl && (
        <CardMedia component="img" height="140" image={imageUrl} alt={title} />
      )}
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      {buttonText && (
        <CardActions>
          <Button size="small" onClick={onButtonClick}>
            {buttonText}
          </Button>
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;
