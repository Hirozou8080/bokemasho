"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, updateProfile } from "@/app/lib/auth";
import MainLayout from "@/app/components/templates/MainLayout";
import {
  Box,
  Paper,
  Avatar,
  CircularProgress,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import Typography from "@/app/components/atoms/Typography";
import TextInput from "@/app/components/atoms/TextField";

interface User {
  uid?: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUser();
        if (response && response.user) {
          setUser(response.user);
          setUsername(response.user.username || "");
          setBio(response.user.bio || "");
        } else {
          // ユーザーデータがない場合はログインページにリダイレクト
          router.push("/auth/login");
        }
      } catch (err) {
        setError("プロフィール情報の取得に失敗しました");
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const updatedData = {
        username,
        bio,
      };

      const result = await updateProfile(updatedData);
      if (result && result.user) {
        setSuccess(true);
        // 更新されたユーザー情報を反映
        setUser(result.user);
        router.push("/profile");
      }
      console.log("プロフィールを更新しました");
    } catch (err) {
      setError("プロフィールの更新に失敗しました");
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
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

  if (!user) {
    return (
      <MainLayout>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6">
            ユーザー情報が見つかりません。ログインしてください。
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/auth/login")}
            sx={{ mt: 2 }}
          >
            ログインする
          </Button>
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
          プロフィール編集
        </Typography>

        <Paper elevation={3} sx={{ width: "100%", maxWidth: 600, p: 4, mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              プロフィールを更新しました！プロフィールページへ移動します...
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Avatar
              src={user.avatar || "/images/robot-logo.png"}
              alt={user.username}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextInput
              label="ユーザー名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              fullWidth
            />

            <TextField
              label="自己紹介"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              margin="normal"
              fullWidth
              multiline
              rows={4}
            />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                variant="outlined"
                onClick={() => router.push("/profile")}
                disabled={saving}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : "保存する"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  );
}
