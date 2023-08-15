import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import BaseLayout from "src/layouts/BaseLayout";

import SuspenseLoader from "src/components/SuspenseLoader";

import { LoggedIn } from "src/gaurds/LoggedIn";
import { Authorized } from "src/gaurds/Authorized";

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages

const Login = Loader(lazy(() => import("src/content/pages/Static/Login")));

const ForgetPassword = Loader(
  lazy(() => import("src/content/pages/Static/ForgetPassword"))
);

// Dashboards

const Home = Loader(lazy(() => import("src/content/pages/dashboard/Home")));
const Restaurants = Loader(
  lazy(() => import("src/content/pages/dashboard/Restaurants"))
);
const MealsAndIngredients = Loader(
  lazy(() => import("src/content/pages/dashboard/MealsAndIngredients"))
);
const Invoices = Loader(
  lazy(() => import("src/content/pages/dashboard/Invoices"))
);
const Companies = Loader(
  lazy(() => import("src/content/pages/dashboard/Companies"))
);
const Menus = Loader(lazy(() => import("src/content/pages/dashboard/Menus")));
const Orders = Loader(lazy(() => import("src/content/pages/dashboard/Orders")));
// Components

// Status

const Status404 = Loader(
  lazy(() => import("src/content/pages/Status/Status404"))
);
const Status403 = Loader(
  lazy(() => import("src/content/pages/Status/Status403"))
);
const Status500 = Loader(
  lazy(() => import("src/content/pages/Status/Status500"))
);
const StatusComingSoon = Loader(
  lazy(() => import("src/content/pages/Status/ComingSoon"))
);
const StatusMaintenance = Loader(
  lazy(() => import("src/content/pages/Status/Maintenance"))
);

const getRoute = () => {
  const user = useSelector((state) => state.user.value);

  return [
    {
      path: "",
      element: <BaseLayout />,
      children: [
        {
          path: "",
          element: <Navigate to="/dashboard" />,
        },
        {
          path: "/login",
          element: <LoggedIn />,
          children: [
            {
              path: "",
              element: <Login />,
            },
          ],
        },
        {
          path: "/forget-password",
          element: <LoggedIn />,
          children: [
            {
              path: "",
              element: <ForgetPassword />,
            },
          ],
        },
        {
          path: "status",
          children: [
            {
              path: "",
              element: <Navigate to="404" replace />,
            },
            {
              path: "403",
              element: <Status403 />,
            },
            {
              path: "404",
              element: <Status404 />,
            },
            {
              path: "500",
              element: <Status500 />,
            },
            {
              path: "maintenance",
              element: <StatusMaintenance />,
            },
            {
              path: "coming-soon",
              element: <StatusComingSoon />,
            },
          ],
        },
        {
          path: "*",
          element: <Status404 />,
        },
      ],
    },
    {
      path: "dashboard",
      element: <Authorized />,
      children: [
        {
          path: "",
          element: <Navigate to="home" replace />,
        },
        {
          path: "home",
          element: user.permissions?.dashboard ? (
            <Home />
          ) : user.role === "restaurant" ? (
            <Navigate to="/dashboard/menus" />
          ) : user.role === "company" ? (
            <Navigate to="/dashboard/menus" />
          ) : user.role === "rider" ? (
            <Navigate to="/dashboard/orders" />
          ) : (
            <Navigate to="status/403" />
          ),
        },
        {
          path: "restaurants",
          children: [
            {
              path: "",
              element: <Navigate to="lists" replace />,
            },
            {
              path: "lists",
              element: user.permissions?.restaurants ? (
                <Restaurants />
              ) : (
                <Navigate to="status/403" />
              ),
            },
          ],
        },
        {
          path: "meals-and-ingredients",
          children: [
            {
              path: "",
              element: <Navigate to="lists" replace />,
            },
            {
              path: "lists",
              element: user.permissions?.meals ? (
                <MealsAndIngredients />
              ) : (
                <Navigate to="status/403" />
              ),
            },
          ],
        },
        {
          path: "invoices",
          children: [
            {
              path: "",
              element: <Navigate to="lists" replace />,
            },
            {
              path: "lists",
              element: user.permissions?.invoices ? (
                <Invoices />
              ) : (
                <Navigate to="status/403" />
              ),
            },
          ],
        },
        {
          path: "companies",
          children: [
            {
              path: "",
              element: <Navigate to="lists" replace />,
            },
            {
              path: "lists",
              element: user.permissions?.companies ? (
                <Companies />
              ) : (
                <Navigate to="status/403" />
              ),
            },
          ],
        },
        {
          path: "menus",
          children: [
            {
              path: "",
              element: <Navigate to="lists" replace />,
            },
            {
              path: "lists",
              element: user.permissions?.menus ? (
                <Menus />
              ) : (
                <Navigate to="status/403" />
              ),
            },
          ],
        },
        {
          path: "orders",
          children: [
            {
              path: "",
              element: <Navigate to="lists" replace />,
            },
            {
              path: "lists",
              element: user.permissions?.orders ? (
                <Orders />
              ) : (
                <Navigate to="status/403" />
              ),
            },
          ],
        },
      ],
    },
  ];
};

export default getRoute;
