import { useContext } from "react";

import {
  // ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem,
} from "@mui/material";
import { NavLink as RouterLink } from "react-router-dom";
import { SidebarContext } from "src/contexts/SidebarContext";

import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BusinessIcon from '@mui/icons-material/Business';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.alpha.white[100]};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[100]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(["color"])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[100]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[100]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.primary.main, 0.2)};
            color: ${theme.colors.primary.dark};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.primary.dark};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
                  "transform",
                  "opacity",
                ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu({ user }) {
  const { closeSidebar } = useContext(SidebarContext);
  const navbar = [];

  const sidebarMenu = {
    dashboard: (
      <ListItem component="div" key="dashboard">
        <Button
          disableRipple
          component={RouterLink}
          onClick={closeSidebar}
          to="/dashboard/home"
          startIcon={<DashboardIcon />}
        >
          Dashbaord
        </Button>
      </ListItem>
    ),
    restaurants: (
      <ListItem component="div" key="restaurants">
        <Button
          disableRipple
          component={RouterLink}
          onClick={closeSidebar}
          to="/dashboard/restaurants"
          startIcon={<RestaurantIcon />}
        >
          Restaurants
        </Button>
      </ListItem>
    ),
    meals: (
      <ListItem component="div" key="meals">
        <Button
          disableRipple
          component={RouterLink}
          onClick={closeSidebar}
          to="/dashboard/meals-and-ingredients"
          startIcon={<RestaurantMenuIcon />}
        >
          Meals & Ingredients
        </Button>
      </ListItem>
    ),
    invoices: (
      <ListItem component="div" key="invoices">
        <Button
          disableRipple
          component={RouterLink}
          onClick={closeSidebar}
          to="/dashboard/invoices"
          startIcon={<ReceiptIcon />}
        >
          Invoices
        </Button>
      </ListItem>
    ),
    companies: (
      <ListItem component="div" key="companies">
        <Button
          disableRipple
          component={RouterLink}
          onClick={closeSidebar}
          to="/dashboard/companies"
          startIcon={<BusinessIcon />}
        >
          Companies
        </Button>
      </ListItem>
    ),
    menus: (
      <ListItem component="div" key="menus">
        <Button
          disableRipple
          component={RouterLink}
          onClick={closeSidebar}
          to="/dashboard/menus"
          startIcon={<MenuBookIcon />}
        >
          Menus
        </Button>
      </ListItem>
    ),
    orders: (
      <ListItem component="div" key="orders">
        <Button
          disableRipple
          component={RouterLink}
          onClick={closeSidebar}
          to="/dashboard/orders"
          startIcon={<InventoryIcon />}
        >
          Orders
        </Button>
      </ListItem>
    ),
    employees: (
      <ListItem component="div" key="employees">
        <Button
          disableRipple
          component={RouterLink}
          onClick={closeSidebar}
          to="/dashboard/employees"
          startIcon={<PeopleIcon />}
        >
          Employees
        </Button>
      </ListItem>
    ),
    reports: false,
  };

  Object.keys(user?.permissions).forEach((access) => {
    if (user.permissions[access] && sidebarMenu[access]) {
      navbar.push(sidebarMenu[access]);
    }
  });

  return (
    <>
      <MenuWrapper>
        <List component="div">
          <SubMenuWrapper>
            <List component="div">{navbar}</List>
          </SubMenuWrapper>
        </List>
      </MenuWrapper>
    </>
  );
}

export default SidebarMenu;
