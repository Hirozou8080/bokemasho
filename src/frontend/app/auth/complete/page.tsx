"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/app/components/templates/MainLayout";
import { Box, Paper } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import Typography from "@/app/components/atoms/Typography";
import Button from "@/app/components/atoms/Button";

// 処理タイプごとのメッセージ
const messages = {
  "password-reset": {
    title: "パスワードのリセットが完了しました",
    description: "新しいパスワードでログインしてください。",
    buttonText: "ログイン画面へ",
    buttonLink: "/auth/login",
  },
  "email-verification": {
    title: "メールアドレスが確認されました",
    description:
      "アカウントが有効化されました。ログインしてサービスをご利用ください。",
    buttonText: "ログイン画面へ",
    buttonLink: "/auth/login",
  },
  registration: {
    title: "ユーザー登録が完了しました",
    description:
      "ご登録いただいたメールアドレスに確認メールを送信しました。メール内のリンクをクリックして、アカウントを有効化してください。",
    buttonText: "ログイン画面へ",
    buttonLink: "/auth/login",
  },
  default: {
    title: "処理が完了しました",
    description: "ご利用ありがとうございます。",
    buttonText: "ホームへ戻る",
    buttonLink: "/",
  },
};

export default function CompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messageType, setMessageType] = useState("default");

  useEffect(() => {
    const action = searchParams.get("action");
    if (action && messages[action as keyof typeof messages]) {
      setMessageType(action);
    }
  }, [searchParams]);

  const currentMessage =
    messages[messageType as keyof typeof messages] || messages.default;

  return (
    <MainLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <CheckCircleOutline
          sx={{
            fontSize: 80,
            color: "success.main",
            mb: 2,
          }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          {currentMessage.title}
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            mt: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body1" paragraph>
            {currentMessage.description}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              component={Link}
              href={currentMessage.buttonLink}
              variant="contained"
              fullWidth
            >
              {currentMessage.buttonText}
            </Button>
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  );
}
