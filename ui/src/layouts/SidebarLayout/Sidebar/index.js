import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import Scrollbar from "src/components/Scrollbar";
import { SidebarContext } from "src/contexts/SidebarContext";

import {
  Box,
  Drawer,
  alpha,
  styled,
  useTheme,
  Button,
  lighten,
  darken,
} from "@mui/material";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";

import Logo from "src/components/Logo";
import SidebarMenu from "./SidebarMenu";

import { clearUser } from "src/redux/user";
import { logout } from "src/utils/logout";

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: ${theme.sidebar.width};
        min-width: ${theme.sidebar.width};
        color: ${theme.colors.alpha.white[100]};
        position: relative;
        z-index: 7;
        height: 100%;
        padding-bottom: 68px;
`
);

function Sidebar() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);

  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  const signout = () => {
    dispatch(clearUser());
    logout();
  };

  const closeSidebar = () => toggleSidebar();

  return (
    <>
      <SidebarWrapper
        sx={{
          display: {
            xs: "none",
            lg: "inline-block",
          },
          position: "fixed",
          left: 0,
          top: 0,
          background:
            theme.palette.mode === "dark"
              ? darken(theme.colors.alpha.black[100], 0.5)
              : alpha(lighten(theme.header.background, 0.1), 0.5),
          boxShadow:
            theme.palette.mode === "dark" ? "none" : theme.sidebar.boxShadow,
        }}
      >
        <Scrollbar>
          <Box>
            <Box
              sx={{
                textAlign: "center",
                background: theme.colors.primary.dark,
                p: theme.spacing(5),
              }}
            >
              <Logo
                sx={{
                  width: "8rem",
                  height: "auto",
                }}
              />
            </Box>
          </Box>
          <SidebarMenu user={user} />
        </Scrollbar>
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={signout}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Sign out
          </Button>
        </Box>
      </SidebarWrapper>
      <Drawer
        sx={{
          boxShadow: `${theme.sidebar.boxShadow}`,
        }}
        anchor={theme.direction === "rtl" ? "right" : "left"}
        open={sidebarToggle}
        onClose={closeSidebar}
        variant="temporary"
        elevation={9}
      >
        <SidebarWrapper
          sx={{
            background:
              theme.palette.mode === "dark"
                ? darken(theme.colors.alpha.black[100], 0.5)
                : theme.colors.alpha.white[100],
          }}
        >
          <Scrollbar>
            <Box mt={2}>
              <Box mx={2}>
                <Logo />
              </Box>
            </Box>
            <SidebarMenu user={user} />
          </Scrollbar>
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default Sidebar;
