"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/app/lib/auth";
import MainLayout from "@/app/components/templates/MainLayout";
import { Box, Paper, Alert, CircularProgress } from "@mui/material";
import Typography from "@/app/components/atoms/Typography";
import TextField from "@/app/components/atoms/TextField";
import Button from "@/app/components/atoms/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/"); // ログイン成功後はホームへリダイレクト
    } catch (err) {
      setError(err instanceof Error ? err.message : "認証に失敗しました");
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
          ログイン
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
              autoFocus
            />
            <TextField
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              fullWidth
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "ログイン"}
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2">
                <Link
                  href="/auth/forgot-password"
                  style={{ textDecoration: "none", color: "primary.main" }}
                >
                  パスワードをお忘れですか？
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                アカウントをお持ちでない方は
                <Link
                  href="/auth/register"
                  style={{
                    textDecoration: "none",
                    color: "primary.main",
                    marginLeft: "8px",
                  }}
                >
                  新規登録
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  );
}
