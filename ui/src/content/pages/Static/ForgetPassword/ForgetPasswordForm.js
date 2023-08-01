import { useState } from "react";
import { useNavigate } from "react-router";
// import { useDispatch } from 'react-redux';

import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { MuiOtpInput } from "mui-one-time-password-input";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// import { apiCall } from 'src/utils/axios';

// import { setUser } from 'src/redux/user';

export default function ForgetPasswordForm() {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [values, setValues] = useState({
    email: "",
    otp: "",
    newpassword: "",
    repeatPassword: "",
  });
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (newValue) => {
    setValues({ ...values, otp: newValue });
  };

  return (
    <>
      {step === 1 && (
        <>
          <Stack direction="row">
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h1" gutterBottom color="secondary">
                Forget Password
              </Typography>
              <Typography variant="subtitle2" color="secondary" sx={{ p: 4 }}>
                Enter your email address to <br />
                reset your password
              </Typography>
            </Box>
          </Stack>

          <Box component="form" autoComplete="off" onSubmit={handleEmailSubmit}>
            <Stack spacing={4}>
              <TextField
                required
                fullWidth
                autoComplete="off"
                type="email"
                label="Email"
                name="email"
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="outlinedSecondary"
                loading={spinner}
              >
                Send
              </LoadingButton>
            </Stack>
          </Box>
        </>
      )}
      {step === 2 && (
        <>
          <Stack direction="row">
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h1" gutterBottom color="secondary">
                Verification Code
              </Typography>
              <Typography variant="subtitle2" color="secondary" sx={{ p: 4 }}>
                Enter the verification Code
              </Typography>
            </Box>
          </Stack>

          <Box component="form" autoComplete="off" onSubmit={handleCodeSubmit}>
            <Stack spacing={4}>
              <MuiOtpInput
                length={4}
                name="otp"
                value={values.otp}
                onChange={handleChange}
                TextFieldsProps={{
                  size: "small",
                  placeholder: "0",
                }}
                sx={{
                  "&.MuiOtpInput-Box": { maxWidth: "300px" },
                }}
              />

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="outlinedSecondary"
                loading={spinner}
              >
                Verify
              </LoadingButton>
            </Stack>
          </Box>
        </>
      )}
      {step === 3 && (
        <>
          <Stack direction="row">
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h1" gutterBottom color="secondary">
                Reset Password
              </Typography>
            </Box>
          </Stack>
          <br />
          <Box
            component="form"
            autoComplete="off"
            onSubmit={handleNewPasswordSubmit}
          >
            <Stack spacing={4}>
              <TextField
                required
                fullWidth
                autoComplete="off"
                type={showPassword ? "text" : "password"}
                label="Password"
                name="newPassword"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
              <TextField
                required
                fullWidth
                autoComplete="off"
                type={showPassword ? "text" : "password"}
                label="Repeat Password"
                name="repeatPassword"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="outlinedSecondary"
                loading={spinner}
              >
                Reset
              </LoadingButton>
            </Stack>
          </Box>
        </>
      )}
    </>
  );
}
