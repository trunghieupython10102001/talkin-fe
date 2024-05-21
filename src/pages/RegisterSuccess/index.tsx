import { Grid, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import SuccessImgSrc from "@/assets/images/success-signup.png";
import { useStyles } from "./styles";
import { useAppSelector } from "@/hooks";

const RegisterSuccess: React.FC = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const { isSuccessRegistered } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isSuccessRegistered) {
      navigate("/");
    } else {
      const id = setTimeout(() => {
        navigate("/login");
      }, 3000);

      return () => {
        clearTimeout(id);
      };
    }
  }, [isSuccessRegistered, navigate]);

  return (
    <Grid container spacing={3} pt={{ xs: 2, md: 23 }}>
      <Grid item xs={12}>
        <Stack spacing={3} alignItems="center">
          <img src={SuccessImgSrc} alt="success" />
          <Typography mb={3} component="h1" variant="h4" fontWeight={800} className={classes.mainContent}>
            You have signed up successfully!
          </Typography>
          <Typography
            component="h1"
            variant="body1"
            align="center"
            marginTop="0px !important"
            className={classes.content}
          >
            You will be redirected to the sign in page shortly.
            <br /> If not, please{" "}
            <Link className={classes.link} to="/login">
              Click here
            </Link>
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default RegisterSuccess;
