import axios from "axios";
import Swal from "sweetalert2";
import { logout } from "./logout";
// ----------------------------------------------------------------------

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 402) {
      Swal.fire(
        "Oops...",
        "Your Session Has Expired Please Login Again!",
        "error"
      ).then(() => {
        logout();
      });
    } else {
      Swal.fire("Oops...", "Server Error!", "error").then(() => {});
    }
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

export const apiGet = async (api) => {
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("token"),
  };
  const res = await axiosInstance.get(
    `${process.env.REACT_APP_SERVER_URL}${api}`,
    {
      headers,
    }
  );
  return res.data;
};

export const apiPost = async (api, body) => {
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("token"),
  };
  const res = await axiosInstance.post(
    `${process.env.REACT_APP_SERVER_URL}${api}`,
    body,
    {
      headers,
    }
  );
  return res.data;
};

export const apiPostFile = async (api, body) => {
  const headers = {
    "Content-Type": "multipart/form-data",
    "x-access-token": localStorage.getItem("token"),
  };
  const res = await axiosInstance.post(
    `${process.env.REACT_APP_SERVER_URL}${api}`,
    body,
    {
      headers,
    }
  );
  return res.data;
};

export const apiPut = async (api, body) => {
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("token"),
  };
  const res = await axiosInstance.put(
    `${process.env.REACT_APP_SERVER_URL}${api}`,
    body,
    {
      headers,
    }
  );
  return res.data;
};

export default axiosInstance;
