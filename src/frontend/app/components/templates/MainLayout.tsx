import React from "react";
import { Box, Container, CssBaseline } from "@mui/material";
import { Header } from "../layouts/Header";
import { Footer } from "../layouts/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <Header />

      <Container component="main" sx={{ flex: "1 0 auto", py: 4 }}>
        {children}
      </Container>

      <Footer />
    </Box>
  );
};

export default MainLayout;
