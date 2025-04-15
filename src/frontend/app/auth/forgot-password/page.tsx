"use client";

import React, { useState } from "react";
import Link from "next/link";
import { sendPasswordResetLink } from "@/app/lib/auth";
import MainLayout from "@/app/components/templates/MainLayout";
import { Box, Paper, Alert, CircularProgress } from "@mui/material";
import Typography from "@/app/components/atoms/Typography";
import TextField from "@/app/components/atoms/TextField";
import Button from "@/app/components/atoms/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await sendPasswordResetLink(email);
      setSuccess(true);
      setEmail(""); // 入力フィールドをクリア
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "リクエストの処理中にエラーが発生しました"
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
          パスワードをリセット
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

          {success ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                パスワードリセットのリンクを送信しました。メールをご確認ください。
              </Alert>
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Button component={Link} href="/auth/login" variant="outlined">
                  ログイン画面に戻る
                </Button>
              </Box>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="body2" sx={{ mb: 2 }}>
                登録したメールアドレスを入力してください。パスワードリセット用のリンクをお送りします。
              </Typography>
              <TextField
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                fullWidth
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  "リセットリンクを送信"
                )}
              </Button>

              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2">
                  <Link
                    href="/auth/login"
                    style={{ textDecoration: "none", color: "primary.main" }}
                  >
                    ログイン画面に戻る
                  </Link>
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </MainLayout>
  );
}
