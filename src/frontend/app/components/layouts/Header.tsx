import React from "react";
import { AppBar, Box, Toolbar, Button } from "@mui/material";
import Typography from "../atoms/Typography";
import Link from "next/link";
import Image from "next/image";
import { LoginButtonWrapper } from "./LoginButtonWrapper";
import { AddCircleOutline } from "@mui/icons-material";

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

        <Button
          component={Link}
          href="/bokeh/create"
          variant="contained"
          color="secondary"
          startIcon={<AddCircleOutline />}
          sx={{ mr: 2, display: { xs: "none", sm: "flex" } }}
        >
          お題を投稿
        </Button>

        <LoginButtonWrapper />
      </Toolbar>
    </AppBar>
  );
}
