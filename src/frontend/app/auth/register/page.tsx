"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/app/lib/auth";
import MainLayout from "@/app/components/templates/MainLayout";
import {
  Box,
  Paper,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import Typography from "@/app/components/atoms/Typography";
import TextField from "@/app/components/atoms/TextField";
import Button from "@/app/components/atoms/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["アカウント情報の入力", "確認", "完了"];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateForm = () => {
    if (!username.trim()) {
      setError("ユーザー名を入力してください");
      return false;
    }
    if (!email.trim()) {
      setError("メールアドレスを入力してください");
      return false;
    }
    if (!password) {
      setError("パスワードを入力してください");
      return false;
    }
    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return false;
    }
    if (password !== passwordConfirmation) {
      setError("パスワードと確認用パスワードが一致しません");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    // バリデーション成功したら確認画面へ（まだAPIは呼ばない）
    handleNext();
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError("");

    try {
      // 確認画面で「登録する」を押したときにAPIを呼ぶ
      await register(username, email, password, passwordConfirmation);
      router.push("/auth/complete?action=registration");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登録処理に失敗しました");
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
          mt: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          新規ユーザー登録
        </Typography>

        <Stepper
          activeStep={activeStep}
          sx={{ width: "100%", maxWidth: 600, mb: 4 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 600,
            mt: 2,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {activeStep === 0 && (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
                fullWidth
                autoFocus
              />
              <TextField
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                fullWidth
              />
              <TextField
                label="パスワード"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                fullWidth
                helperText="8文字以上で入力してください"
              />
              <TextField
                label="パスワード（確認用）"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                margin="normal"
                required
                fullWidth
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Button component={Link} href="/auth/login" variant="text">
                  ログイン画面へ戻る
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "次へ"}
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                入力内容の確認
              </Typography>
              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle1">ユーザー名:</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {username}
                </Typography>

                <Typography variant="subtitle1">メールアドレス:</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {email}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 2, mb: 2, color: "text.secondary" }}
                >
                  上記の内容で登録を行います。よろしいですか？
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Button onClick={handleBack} variant="outlined">
                  戻る
                </Button>
                <Button
                  onClick={handleConfirm}
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "登録する"}
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                登録が完了しました
              </Typography>
              <Typography variant="body1" paragraph>
                ご登録いただいたメールアドレスに確認メールを送信しました。
                メール内のリンクをクリックして、アカウントを有効化してください。
              </Typography>
              <Button
                component={Link}
                href="/auth/login"
                variant="contained"
                sx={{ mt: 2 }}
              >
                ログイン画面へ
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </MainLayout>
  );
}
