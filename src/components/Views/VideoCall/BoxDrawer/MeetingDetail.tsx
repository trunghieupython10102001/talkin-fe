import { Box, Button, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useStyles } from "./styles";

import CopyToClipboard from "react-copy-to-clipboard";
import { CopyActiveIcon, CloseIcon } from "@/assets";

const MeetingDetail: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { roomId } = useParams();
  const classes = useStyles();
  const [isCopy, setCopy] = useState(false);
  const location = window.location.origin;

  const handleOnCopy = () => {
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 1000);
  };

  const contentCopy = () => {
    return `${location}/video-call/${roomId}`;
  };
  return (
    <>
      <Box component="div" height="3rem" className={classes.title}>
        <Typography component="h2" variant="h6">
          Meeting information
        </Typography>
        <CloseIcon onClick={onClose} className={classes.close} />
      </Box>
      <Box component="div" className={classes.boxDrawerContent}>
        <Typography component="h6" mt={2}>
          <NavLink to={`${location}/video-call/${roomId}`} className={classes.link}>
            Meeting link
          </NavLink>
        </Typography>

        <Typography component="h6" mt={2}>
          Meeting ID: {roomId}
        </Typography>
        <CopyToClipboard text={contentCopy()} onCopy={handleOnCopy}>
          <Tooltip
            title={"Copied!"}
            open={isCopy}
            placement="top"
            disableFocusListener
            disableHoverListener
            disableTouchListener
          >
            <Button variant="outlined" startIcon={<CopyActiveIcon />} className={classes.btnCopy}>
              Copy meeting link
            </Button>
          </Tooltip>
        </CopyToClipboard>
      </Box>
    </>
  );
};

export default MeetingDetail;
