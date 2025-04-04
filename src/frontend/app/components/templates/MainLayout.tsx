import React from "react";
import { AppBar, Box, Container, Toolbar, CssBaseline } from "@mui/material";
import Typography from "../atoms/Typography";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  console.log("MainLayout");
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ボケ魔性
          </Typography>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flex: "1 0 auto", py: 4 }}>
        {children}
      </Container>

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
    </Box>
  );
};

export default MainLayout;
