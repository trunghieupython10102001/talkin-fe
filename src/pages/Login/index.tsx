import { useEffect } from "react";
import { Box, Button, Card, CardContent, IconButton, InputAdornment, TextField, Typography } from "@mui/material";

import { ReactComponent as EnvelopeIcon } from "@/assets/svg/envelope.svg";
import { ReactComponent as LockIcon } from "@/assets/svg/lock.svg";
import { ReactComponent as EyeSlashIcon } from "@/assets/svg/eye-slash.svg";

import { ReactComponent as EyeIcon } from "@/assets/svg/eye.svg";

import React, { useState } from "react";
import { useLogin } from "@/hooks";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { COOKIES_STORAGE_KEY } from "@/constants";
import { useStyles } from "./styles";
const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { loginFormik } = useLogin();
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    const isLogin = Cookies.get(COOKIES_STORAGE_KEY.ACCESS_TOKEN);
    if (isLogin) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Card elevation={4} className={classes.signinContainer}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} textAlign="center" className={classes.title}>
          Sign in to Talkin
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            loginFormik.handleSubmit();
          }}
          mt={2}
        >
          <TextField
            margin="normal"
            variant="outlined"
            fullWidth
            placeholder="Email"
            name="email"
            value={loginFormik.values.email}
            onChange={loginFormik.handleChange}
            onBlur={loginFormik.handleBlur}
            autoFocus
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EnvelopeIcon />
                </InputAdornment>
              ),
            }}
          />
          {loginFormik.errors.email && loginFormik.touched.email && (
            <Typography variant="body2" color="error.main">
              {loginFormik.errors.email}
            </Typography>
          )}
          <TextField
            margin="normal"
            fullWidth
            variant="outlined"
            placeholder="Password"
            name="password"
            value={loginFormik.values.password}
            onChange={loginFormik.handleChange}
            onBlur={loginFormik.handleBlur}
            type={showPassword ? "text" : "password"}
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                  </IconButton>
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
          {loginFormik.errors.password && loginFormik.touched.password && (
            <Typography variant="body2" color="error.main">
              {loginFormik.errors.password}
            </Typography>
          )}

          <Typography variant="body1" className={classes.forget}>
            <Link to={"/"}>Forgot your password?</Link>{" "}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!(loginFormik.dirty && loginFormik.isValid)}
          >
            <Typography fontWeight={700}>Sign in to Talkin</Typography>
          </Button>
          <Typography variant="body1" className={classes.use}>
            Need an account? <Link to={"/register"}>Sign up</Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Login;
