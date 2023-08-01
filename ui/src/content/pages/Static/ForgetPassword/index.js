import { lazy } from "react";

import {
  Container,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Page = lazy(() => import("src/components/Page"));
const ForgetPasswordForm = lazy(() => import("./ForgetPasswordForm"));

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
    <Page title="Forget Password">
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <RootStyle>
        <Container maxWidth="md">
          <ContentStyle>
            <ForgetPasswordForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
