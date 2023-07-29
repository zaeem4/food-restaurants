import { lazy, useEffect, useState } from "react";

import {
  Box,
  Stack,
  Container,
  Typography,
  CircularProgress,
  Paper,
  Backdrop,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Page = lazy(() => import("src/components/Page"));
const Logo = lazy(() => import("src/components/Logo"));
const LoginForm = lazy(() => import("./LoginForm"));

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

// const SectionStyle = styled(Paper)(({ theme }) => ({
//   width: "100%",
//   maxWidth: "50%",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   backgroundColor: theme.palette.background.dark,
// }));

const ContentStyle = styled("div")(({ theme }) => ({
  // maxWidth: "100%",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(10, 8),
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: theme.palette.primary.main,
}));

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <Page title="Login">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <RootStyle>
        <Container maxWidth="md">
          <ContentStyle>
            {/* <Stack sx={{ textAlign: "center", marginTop: "-5rem" }}>
              <Logo
                sx={{
                  width: "10rem",
                  height: "10rem",
                }}
              />
            </Stack> */}

            <Stack direction="row" sx={{ mb: 5 }}>
              <Box sx={{ margin: "auto" }}>
                <Typography variant="h1" gutterBottom color="secondary">
                  Login
                </Typography>
              </Box>
            </Stack>

            <LoginForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
