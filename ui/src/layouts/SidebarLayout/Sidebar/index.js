import { useContext } from "react";
// import { NavLink as RouterLink } from "react-router-dom";

import { useDispatch } from "react-redux";
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
  const dispatch = useDispatch();

  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();

  const signout = () => {
    dispatch(clearUser());
    logout();
  };

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
          {/* <Divider
            sx={{
              mt: theme.spacing(3),
              mx: theme.spacing(2),
              background: theme.colors.alpha.trueWhite[10],
            }}
          /> */}
          <SidebarMenu />
        </Scrollbar>
        {/* <Divider
          sx={{
            background: theme.colors.alpha.trueWhite[10],
          }}
        /> */}
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
              <Box
                mx={2}
                // sx={{
                //   width: 52,
                // }}
              >
                <Logo />
              </Box>
            </Box>
            {/* <Divider
              sx={{
                mt: theme.spacing(3),
                mx: theme.spacing(2),
                background: theme.colors.alpha.trueWhite[10],
              }}
            /> */}
            <SidebarMenu />
          </Scrollbar>
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default Sidebar;
