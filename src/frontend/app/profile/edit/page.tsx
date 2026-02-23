"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

const DEFAULT_ICON = "/images/robot-logo.png";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
];

interface User {
  uid?: number;
  username: string;
  email: string;
  icon_url?: string;
  bio?: string;
}

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

  // Crop states
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

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

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, 1));
    },
    [],
  );

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック
    if (file.size > MAX_FILE_SIZE) {
      setError(
        `ファイルサイズが大きすぎます（${(file.size / 1024 / 1024).toFixed(1)}MB）。10MB以下のファイルを選択してください。`,
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // ファイル形式チェック
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(
        `対応していないファイル形式です。対応形式: JPEG, PNG, GIF, WebP, HEIC`,
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setError("");

    // 画像をData URLとして読み込み、トリミングダイアログを開く
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImage = useCallback(async (): Promise<File | null> => {
    if (!imgRef.current || !completedCrop) return null;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], "icon.jpg", { type: "image/jpeg" });
            resolve(file);
          } else {
            resolve(null);
          }
        },
        "image/jpeg",
        0.9,
      );
    });
  }, [completedCrop]);

  const handleCropConfirm = async () => {
    const croppedFile = await getCroppedImage();
    if (croppedFile) {
      setIconFile(croppedFile);
      // トリミング後のプレビューを生成
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(croppedFile);
    }
    setCropDialogOpen(false);
    setImageSrc("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropCancel = () => {
    setCropDialogOpen(false);
    setImageSrc("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

      {/* トリミングダイアログ */}
      <Dialog
        open={cropDialogOpen}
        onClose={handleCropCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>画像をトリミング</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            アイコンとして使用する部分を選択してください
          </Typography>
          {imageSrc && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="トリミング用画像"
                  onLoad={onImageLoad}
                  style={{ maxHeight: "60vh", maxWidth: "100%" }}
                />
              </ReactCrop>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCropCancel}>キャンセル</Button>
          <Button onClick={handleCropConfirm} variant="contained">
            適用
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
