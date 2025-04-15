import React from "react";
import { Box, Container } from "@mui/material";
import Typography from "../atoms/Typography";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{ py: 3, px: 2, mt: "auto", backgroundColor: "primary.main" }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2" color="#212121" align="center">
          © {new Date().getFullYear()} ボケ魔性
        </Typography>
      </Container>
    </Box>
  );
}
