import React, { useEffect, useState } from "react";
import moment from "moment";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { ReactComponent as ClockIcon } from "@/assets/svg/clock.svg";
import classNames from "classnames";

const useStyles = makeStyles((theme: Theme) => {
  return {
    timestamp: {
      color: theme.palette.primary.dark,
      display: "flex",
      padding: "0 30px",
      alignItems: "center",
      gap: "5px",
      "& > h6": {
        fontSize: "1rem",
      },
    },
    title: {
      fontSize: `16px !important`,
      fontWeight: "bold !important",
      color: theme.palette.primary.dark,
    },
    light: {
      color: theme.palette.primary.white,
    },
    clock: {
      border: "none",
    },
    border: {
      border: "none",
      padding: "0px",
      "& h6": {
        fontSize: `12px !important`,
      },
    },
  };
});

const Timestamp: React.FC<{ type?: boolean; icon?: boolean; border?: boolean; time?: string }> = ({
  type,
  icon,
  border,
  time,
}) => {
  const classes = useStyles();
  const [currentTime, setCurrentTime] = useState(moment().format("hh:mm A [•] ddd, MMM D "));

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime(moment().format("hh:mm A [•] ddd, MMM D"));
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [currentTime]);

  const getTimeFormat = () => {
    return moment(time).format("hh:mm A [•] ddd, MMM D");
  };

  return (
    <div className={classNames(classes.timestamp, { [classes.clock]: icon })}>
      {icon && <ClockIcon />}
      <Typography variant="h6" className={`${classes.title} ${type && classes.light}`}>
        {time ? getTimeFormat() : currentTime}
      </Typography>
    </div>
  );
};
export default Timestamp;
