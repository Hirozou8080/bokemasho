"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/lib/auth";
import MainLayout from "@/app/components/templates/MainLayout";
import { Box, Paper, Alert, CircularProgress } from "@mui/material";
import Typography from "@/app/components/atoms/Typography";
import TextField from "@/app/components/atoms/TextField";
import Button from "@/app/components/atoms/Button";

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // URLパラメータからtokenとemailを取得
    const urlToken = searchParams.get("token");
    const urlEmail = searchParams.get("email");

    if (urlToken) setToken(urlToken);
    if (urlEmail) setEmail(urlEmail);

    if (!urlToken || !urlEmail) {
      setError(
        "無効なリセットリンクです。もう一度パスワードリセットをお試しください。"
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError("パスワードと確認用パスワードが一致しません。");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await resetPassword(email, password, passwordConfirmation, token);
      router.push("/auth/complete?action=password-reset");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "パスワードのリセットに失敗しました"
      );
    } finally {
      setLoading(false);
    }
  };

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
        <Typography variant="h4" component="h1" gutterBottom>
          新しいパスワードを設定
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            mt: 2,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              fullWidth
              disabled={!!searchParams.get("email")}
            />
            <TextField
              label="新しいパスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              fullWidth
            />
            <TextField
              label="新しいパスワード（確認用）"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              margin="normal"
              required
              fullWidth
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !token || !email}
            >
              {loading ? <CircularProgress size={24} /> : "パスワードを変更"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 8,
            }}
          >
            <Typography variant="h4" component="h1">
              読み込み中...
            </Typography>
          </Box>
        </MainLayout>
      }
    >
      <ResetPasswordPageContent />
    </Suspense>
  );
}
