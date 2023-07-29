import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

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
// Components

// Status

const Status404 = Loader(
  lazy(() => import("src/content/pages/Status/Status404"))
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

const Router = [
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
        path: "status",
        children: [
          {
            path: "",
            element: <Navigate to="404" replace />,
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
        element: <Home />,
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
            element: <Restaurants />,
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
            element: <MealsAndIngredients />,
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
            element: <Invoices />,
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
            element: <Companies />,
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
            element: <Menus />,
          },
        ],
      },
    ],
  },
];

export default Router;
