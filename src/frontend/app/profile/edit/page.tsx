"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useUser, useUpdateProfile } from "@/app/hooks/useAuth";

const DEFAULT_ICON = "/images/robot-logo.png";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function EditProfilePage() {
  const router = useRouter();

  // React Query フック
  const { data: user, isLoading } = useUser();
  const updateProfileMutation = useUpdateProfile();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop states
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  // ユーザーデータが読み込まれたらフォームに反映
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
      setIconPreview(user.icon_url || DEFAULT_ICON);
    }
  }, [user]);

  // 未ログインの場合はログインページにリダイレクト
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [isLoading, user, router]);

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
    setError("");
    setSuccess(false);

    const updatedData: { username: string; bio: string; icon?: File } = {
      username,
      bio,
    };

    if (iconFile) {
      updatedData.icon = iconFile;
    }

    updateProfileMutation.mutate(updatedData, {
      onSuccess: () => {
        setSuccess(true);
        router.push("/profile");
      },
      onError: () => {
        setError("プロフィールの更新に失敗しました");
      },
    });
  };

  if (isLoading) {
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
                disabled={updateProfileMutation.isPending}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? <CircularProgress size={24} /> : "保存する"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  );
}
