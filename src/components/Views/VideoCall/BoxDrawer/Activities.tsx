import { Box, Typography } from "@mui/material";
import React from "react";
import { useStyles } from "./styles";
import { CloseIcon } from "@/assets";

const Activities: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const classes = useStyles();
  return (
    <>
      <Box component="div" height="3rem" className={classes.title}>
        <Typography component="h2" variant="h6">
          Activities
        </Typography>
        <CloseIcon onClick={onClose} className={classes.close} />
      </Box>
      <Box component="div" className={classes.boxDrawerContent}>

      </Box>
    </>
  );
};

export default Activities;
