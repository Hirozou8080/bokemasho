"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, getCsrfToken, getXsrfToken } from "@/app/lib/auth";
import MainLayout from "@/app/components/templates/MainLayout";
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

export default function CreateBokehTopicPage() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getUser();
        if (!(response && response.user)) {
          // ログインしていない場合はログインページにリダイレクト
          router.push("/auth/login");
        }
      } catch (err) {
        setError("認証情報の取得に失敗しました");
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      // プレビュー用のURL作成
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    if (!image) {
      setError("画像を選択してください");
      setSubmitting(false);
      return;
    }

    try {
      // CSRFトークンを取得
      await getCsrfToken();
      const xsrfToken = await getXsrfToken();

      // APIエンドポイントのベースURL
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.100:8080/api";

      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(`${API_URL}/bokeh-topics`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": xsrfToken,
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "ボケお題の投稿に失敗しました");
      }

      setSuccess(true);
      setImage(null);
      setPreviewUrl(null);

      // 成功後1.5秒後にホームページにリダイレクト
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      console.error("Failed to submit bokeh topic:", err);
      setError("ボケお題の投稿に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

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
          ボケお題を投稿
        </Typography>

        <Paper elevation={3} sx={{ width: "100%", maxWidth: 600, p: 4, mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              ボケお題を投稿しました！トップページに戻ります...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box
              sx={{
                border: "2px dashed #ccc",
                p: 3,
                borderRadius: 2,
                textAlign: "center",
                mb: 3,
              }}
            >
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUpload />}
                >
                  画像をアップロード
                </Button>
              </label>
              <Typography variant="body2" sx={{ mt: 1 }}>
                JPG, PNG, GIF形式 (最大2MB)
              </Typography>
            </Box>

            {previewUrl && (
              <Box sx={{ mt: 2, mb: 3, textAlign: "center" }}>
                <Typography variant="subtitle1" gutterBottom>
                  プレビュー:
                </Typography>
                <img
                  src={previewUrl}
                  alt="プレビュー"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "4px",
                  }}
                />
              </Box>
            )}

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting || !image}
              >
                {submitting ? <CircularProgress size={24} /> : "投稿する"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  );
}
