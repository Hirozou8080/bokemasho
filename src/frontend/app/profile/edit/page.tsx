"use client";

import React, { useState, useEffect, useRef } from "react";
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
  IconButton,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import Typography from "@/app/components/atoms/Typography";
import TextInput from "@/app/components/atoms/TextField";

const DEFAULT_ICON = "/images/robot-logo.png";

interface User {
  uid?: number;
  username: string;
  email: string;
  icon_url?: string;
  bio?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUser();
        if (response && response.user) {
          setUser(response.user);
          setUsername(response.user.username || "");
          setBio(response.user.bio || "");
          setIconPreview(response.user.icon_url || DEFAULT_ICON);
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

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const updatedData: { username: string; bio: string; icon?: File } = {
        username,
        bio,
      };

      if (iconFile) {
        updatedData.icon = iconFile;
      }

      const result = await updateProfile(updatedData);
      console.log(result);
      if (result && result.data) {
        setSuccess(true);
        // 更新されたユーザー情報を反映
        setUser(result.data);
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

        <Alert severity="info" sx={{ width: "100%", maxWidth: 600, mt: 2 }}>
          プロフィールの変更は、他のデバイスに反映されるまで最大5分かかる場合があります。
        </Alert>

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
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={iconPreview || DEFAULT_ICON}
                alt={user.username}
                sx={{ width: 120, height: 120, mb: 2, cursor: "pointer" }}
                onClick={handleIconClick}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: -8,
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
                onClick={handleIconClick}
                size="small"
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleIconChange}
                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp,image/heic,image/heif"
                style={{ display: "none" }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              クリックしてアイコンを変更
            </Typography>
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
