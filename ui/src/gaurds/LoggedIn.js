import { Navigate, Outlet } from "react-router-dom";

export const LoggedIn = () => {
  const token = localStorage.getItem("token");

  /* eslint-disable */
  if (token) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Outlet />;
  }
  /* eslint-enable */
};
