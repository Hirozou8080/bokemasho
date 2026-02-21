"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";

interface LoginRequiredDialogProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

export default function LoginRequiredDialog({
  open,
  onClose,
  message = "この機能を使うにはログインをしてください。",
}: LoginRequiredDialogProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push("/auth/login");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>ログインが必要です</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
        <Button onClick={handleLogin} color="primary" variant="contained">
          ログインページへ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
