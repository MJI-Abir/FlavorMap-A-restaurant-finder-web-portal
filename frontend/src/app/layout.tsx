"use client";

import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme/theme";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import Link from "next/link";
import React from "react";

interface Props {
  children: React.ReactNode;
  window?: () => Window;
}

function ElevationScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(
    children as React.ReactElement<{ elevation?: number }>,
    {
      elevation: trigger ? 4 : 0,
    }
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <ElevationScroll>
              <AppBar
                position="sticky"
                color="default"
                sx={{ bgcolor: "background.paper" }}
              >
                <Toolbar>
                  <Link
                    href="/"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      edge="start"
                      color="inherit"
                      aria-label="menu"
                      sx={{ mr: 2 }}
                    >
                      <RestaurantIcon color="primary" />
                    </IconButton>
                    <Typography
                      variant="h6"
                      component="div"
                      color="primary"
                      fontWeight="bold"
                    >
                      Restaurant Finder BD
                    </Typography>
                  </Link>
                </Toolbar>
              </AppBar>
            </ElevationScroll>

            <Container component="main" sx={{ py: 4, flexGrow: 1 }}>
              {children}
            </Container>

            <Box
              component="footer"
              sx={{
                py: 3,
                textAlign: "center",
                bgcolor: "background.paper",
                mt: "auto",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Restaurant Finder Bangladesh
              </Typography>
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
