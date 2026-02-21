"use client";

import React from "react";
import { AppBar, Box, Toolbar, Button, ButtonGroup } from "@mui/material";
import Typography from "../atoms/Typography";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LoginButtonWrapper } from "./LoginButtonWrapper";
import {
  AddCircleOutline,
  ListAlt,
  Home,
  EmojiEmotions,
} from "@mui/icons-material";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: "primary" | "secondary";
  exact?: boolean;
}

export function Header() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/", label: "ホーム", icon: <Home />, color: "primary", exact: true },
    { href: "/joke_topic/list", label: "お題一覧", icon: <ListAlt />, color: "primary" },
    { href: "/jokes", label: "ボケ一覧", icon: <EmojiEmotions />, color: "primary" },
    { href: "/joke_topic/create", label: "お題を投稿", icon: <AddCircleOutline />, color: "secondary" },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              src="/images/robot-logo.png"
              alt="ボケ魔性ロゴ"
              width={40}
              height={40}
              style={{ marginRight: "10px", borderRadius: "50%" }}
            />
            <Typography variant="h6" component="div">
              ボケ魔性
            </Typography>
          </Link>
        </Box>

        <ButtonGroup
          variant="contained"
          sx={{ mr: 2, display: { xs: "none", sm: "flex" } }}
        >
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                startIcon={item.icon}
                color={item.color}
                variant={active ? "outlined" : "contained"}
                sx={{
                  ...(active && {
                    backgroundColor: "white",
                    color: item.color === "secondary" ? "secondary.main" : "primary.main",
                    borderColor: "white",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                  }),
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </ButtonGroup>

        <LoginButtonWrapper />
      </Toolbar>
    </AppBar>
  );
}
