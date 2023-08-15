import { lazy } from "react";

import {
  Box,
  Stack,
  Container,
  Typography,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Page = lazy(() => import("src/components/Page"));
const LoginForm = lazy(() => import("./LoginForm"));

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

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
  [theme.breakpoints.down("sm")]: {
    height: "100%",
  },
}));

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <Page title="Login">
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={false}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <RootStyle>
        <Container maxWidth="md">
          <ContentStyle>
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
