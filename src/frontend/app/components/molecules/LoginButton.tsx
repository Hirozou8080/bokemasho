"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, logout } from "@/app/lib/auth";
import Button from "@/app/components/atoms/Button";
import { Menu, MenuItem, Avatar } from "@mui/material";
import { PersonOutline, ExitToApp } from "@mui/icons-material";

interface User {
  uid: number;
  username: string;
  nickname?: string;
  avatar?: string;
}

export default function LoginButton() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        if (response && response.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
    }
    handleClose();
  };

  if (loading) {
    return (
      <Button variant="text" disabled>
        読み込み中...
      </Button>
    );
  }

  if (!user) {
    return (
      <Button
        component={Link}
        href="/auth/login"
        variant="contained"
        color="secondary"
        startIcon={<PersonOutline />}
        sx={{ fontWeight: "bold" }}
      >
        ログイン
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="text"
        onClick={handleClick}
        startIcon={
          user.avatar ? (
            <Avatar src={user.avatar} sx={{ width: 28, height: 28 }} />
          ) : (
            <PersonOutline sx={{ color: "white" }} />
          )
        }
        sx={{ color: "white" }}
      >
        {user.nickname || user.username}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem component={Link} href="/profile" onClick={handleClose}>
          プロフィール
        </MenuItem>
        <MenuItem
          component={Link}
          href="/joke_topic/create"
          onClick={handleClose}
        >
          お題を投稿
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ExitToApp fontSize="small" sx={{ mr: 1 }} />
          ログアウト
        </MenuItem>
      </Menu>
    </>
  );
}
