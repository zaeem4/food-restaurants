import { Navigate } from 'react-router-dom';

import SidebarLayout from 'src/layouts/SidebarLayout';

export const Authorized = () => {
  const token = localStorage.getItem('TOKEN');

  return <SidebarLayout />;
  /* eslint-disable */
  // if (token) {
  // } else {
  //   return <Navigate to="/login" />;
  // }
  /* eslint-enable */
};
