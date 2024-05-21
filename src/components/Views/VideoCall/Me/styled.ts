import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";

export const useStyles = makeStyles((theme: Theme) => {
  return {
    cardMe: {
      height: "20rem",
      width: "100%",
      "& .MuiCardContent-root": {
        position: "relative",
        height: "100%",
        '& .MuiBox-root': {
          height: "100%",
        }
      },
    },
  };
});
