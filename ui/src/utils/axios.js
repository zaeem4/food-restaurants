import axios from 'axios';
// import swal from 'sweetalert';
// import { logout } from './logout';
// ----------------------------------------------------------------------

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response.data.data,
  (error) => error.response
);

const headers = {
  bearer: `${localStorage.getItem('TOKEN')}`
};

export const apiCall = async (func, body) => {
  const response = await axiosInstance.post(
    `${process.env.REACT_APP_SERVER_URL}`,
    body,
    {
      headers
    },
    {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  );
  return response[func];
};

export default axiosInstance;
