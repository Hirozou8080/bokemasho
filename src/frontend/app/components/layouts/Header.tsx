import React from "react";
import { AppBar, Box, Toolbar, Button, ButtonGroup } from "@mui/material";
import Typography from "../atoms/Typography";
import Link from "next/link";
import Image from "next/image";
import { LoginButtonWrapper } from "./LoginButtonWrapper";
import {
  AddCircleOutline,
  ListAlt,
  Home,
  EmojiEmotions,
} from "@mui/icons-material";

export function Header() {
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
          <Button
            component={Link}
            href="/"
            startIcon={<Home />}
            color="primary"
          >
            ホーム
          </Button>
          <Button
            component={Link}
            href="/joke_topic/list"
            startIcon={<ListAlt />}
            color="primary"
          >
            お題一覧
          </Button>
          <Button
            component={Link}
            href="/jokes"
            startIcon={<EmojiEmotions />}
            color="primary"
          >
            ボケ一覧
          </Button>
          <Button
            component={Link}
            href="/joke_topic/create"
            startIcon={<AddCircleOutline />}
            color="secondary"
          >
            お題を投稿
          </Button>
        </ButtonGroup>

        <LoginButtonWrapper />
      </Toolbar>
    </AppBar>
  );
}
