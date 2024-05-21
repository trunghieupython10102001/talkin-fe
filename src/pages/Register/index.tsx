import { Box, Button, Card, CardContent, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

import { ReactComponent as EnvelopeIcon } from "@/assets/svg/envelope.svg";
import { ReactComponent as LockIcon } from "@/assets/svg/lock.svg";
import { ReactComponent as EyeSlashIcon } from "@/assets/svg/eye-slash.svg";
import { ReactComponent as EyeIcon } from "@/assets/svg/eye.svg";

import { useRegister } from "@/hooks";
import { useNoAuthGuard } from "@/hooks/use-no-auth-guard";
import { useStyles } from "./styles";
import { Link } from "react-router-dom";
const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const { registerFormik } = useRegister();

  useNoAuthGuard();
  const classes = useStyles();

  return (
    <Card elevation={4} className={classes.signupContainer}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} textAlign="center" className={classes.title}>
          Create new Talkin account
        </Typography>
        <Box
          component="form"
          mt={2}
          onSubmit={(e) => {
            e.preventDefault();
            registerFormik.handleSubmit();
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                fullWidth
                name="firstname"
                placeholder="First name"
                value={registerFormik.values.firstname}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                autoComplete="off"
                error={!!registerFormik.errors.firstname && !!registerFormik.touched.firstname}
                helperText={!!registerFormik.touched.firstname && registerFormik.errors.firstname}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                fullWidth
                placeholder="Last name"
                name="lastname"
                value={registerFormik.values.lastname}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                autoComplete="off"
                error={!!registerFormik.errors.lastname && !!registerFormik.touched.lastname}
                helperText={!!registerFormik.touched.lastname && registerFormik.errors.lastname}
              />
            </Grid>
          </Grid>
          <TextField
            margin="normal"
            fullWidth
            placeholder="Email"
            name="email"
            value={registerFormik.values.email}
            onChange={registerFormik.handleChange}
            onBlur={registerFormik.handleBlur}
            autoComplete="off"
            error={!!registerFormik.errors.email && !!registerFormik.touched.email}
            helperText={!!registerFormik.touched.email && registerFormik.errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EnvelopeIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            fullWidth
            placeholder="Password"
            name="password"
            value={registerFormik.values.password}
            onChange={registerFormik.handleChange}
            onBlur={registerFormik.handleBlur}
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
            error={!!registerFormik.errors.password && !!registerFormik.touched.password}
            helperText={!!registerFormik.touched.password && registerFormik.errors.password}
          />

          <TextField
            margin="normal"
            fullWidth
            placeholder="Confirm password"
            name="confirmPassword"
            value={registerFormik.values.confirmPassword}
            onChange={registerFormik.handleChange}
            onBlur={registerFormik.handleBlur}
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    onMouseDown={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeIcon /> : <EyeSlashIcon />}
                  </IconButton>
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
            error={!!registerFormik.errors.confirmPassword && !!registerFormik.touched.confirmPassword}
            helperText={!!registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!(registerFormik.dirty && registerFormik.isValid)}
          >
            <Typography fontWeight={700}>Sign Up for Talkin</Typography>
          </Button>

          <Typography variant="body1" className={classes.use}>
            Already have Talkin account? <Link to={"/login"}>Sign in</Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Register;
