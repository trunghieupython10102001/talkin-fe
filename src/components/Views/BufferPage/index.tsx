import React, { useEffect } from "react";
import { Typography, Button, Container } from "@mui/material";
import { useStyles } from "./styles";
import { RemoveMeetingIcon } from "@/assets";

interface IBufferPageProps {
  title: string;
  linkRedirect: string;
  icon?: React.ReactNode;
}

const BufferPage: React.FC<IBufferPageProps> = ({ title, linkRedirect, icon = <RemoveMeetingIcon /> }) => {
  const classes = useStyles();

  useEffect(() => {
    const id = setTimeout(() => {
      window.location.href = linkRedirect;
    }, 5000);

    return () => {
      clearTimeout(id);
    };
  }, [linkRedirect]);

  return (
    <Container className={classes.endLive}>
      {icon}
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body1" className={classes.endLiveDescription}>
        You will be redirected to the home page shortly.
        <br /> If not, please click the below button.
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          window.location.href = linkRedirect;
        }}
      >
        Return to home page
      </Button>
    </Container>
  );
};

export default BufferPage;
