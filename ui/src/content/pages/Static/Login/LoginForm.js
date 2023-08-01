import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

import Swal from "sweetalert2";
import { apiPost } from "src/utils/axios";

import { setUser } from "src/redux/user";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [checked, setChecked] = useState(true);

  const LoginSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be 6 characters at minimum"),
    email: Yup.string().required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,

    onSubmit: async () => {
      try {
        setSpinner(true);
        formik.values.email = formik.values.email.toLowerCase();

        const data = await apiPost(`/login`, formik.values);

        if (data.success) {
          localStorage.setItem("token", data.token);
          dispatch(setUser(data.userDetails));

          navigate({ pathname: "/dashboard" });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.error,
          });

          setSpinner(false);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error,
        });
        setSpinner(false);
      }
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="off"
            type="text"
            label="Email address"
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="off"
            type={showPassword ? "text" : "password"}
            label="Password"
            {...getFieldProps("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
                name="checked"
                color="secondary"
              />
            }
            label="Remember me"
          />
          <Typography
            variant="subtitle1"
            color="secondary"
            sx={{ textDecoration: "none", cursor: "pointer" }}
            onClick={() => navigate({ pathname: "/forget-password" })}
          >
            Forgot Password?
          </Typography>
        </Stack>

        <br />
        <br />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="outlinedSecondary"
          loading={spinner}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
