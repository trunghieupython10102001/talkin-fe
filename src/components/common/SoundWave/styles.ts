import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) => {
  return {
    boxSoundContainer: {
      display: "flex",
      justifyContent: "space-between",
      height: "1.1rem",
      width: "calc((0.2rem + 0.1rem) * 5)",
    },
    box: {
      transform: "scaleY(.4)",
      height: "100%",
      width: "0.2rem",
      background: theme.palette.common.white,
      animationTimingFunction: "ease-in-out",
      animationIterationCount: "infinite",
      borderRadius: "0.5rem",
    },
    boxDuration: {
      animationDuration: "1.2s",
    },
    "@keyframes quiet": {
      "25%": {
        transform: "scaleY(.6)",
      },
      "50%": {
        transform: "scaleY(.4)",
      },
      "75%": {
        transform: "scaleY(.8)",
      },
    },
    "@keyframes normal": {
      "25%": {
        transform: "scaleY(1)",
      },
      "50%": {
        transform: "scaleY(.4)",
      },
      "75%": {
        transform: "scaleY(.6)",
      },
    },
    "@keyframes loud": {
      "25%": {
        transform: "scaleY(1)",
      },
      "50%": {
        transform: "scaleY(.4)",
      },
      "75%": {
        transform: "scaleY(1.2)",
      },
    },
    box1: {
      animationName: "$quiet",
    },
    box2: {
      animationName: "$normal",
    },
    box3: {
      animationName: "$quiet",
    },
    box4: {
      animationName: "$loud",
    },
    box5: {
      animationName: "$quiet",
    },
  };
});
