import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapperFormChat: {
      position: "absolute",
      width: "100%",
      bottom: 0,
      left: 0,
      "& .MuiInputBase-root": {
        width: "100%"
      }
    },
    wrapperInputChat: {
      borderRadius: theme.shape.borderRadius,
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      "& .MuiInputBase-input": {
        borderRadius: "1.3125rem",
        padding: "0.625rem 0.625rem 0.625rem 0.9375rem",
        background: theme.palette.primary.grey93,
      },
    },
    sendActive: {
      "& svg": {
        fill: theme.palette.primary.activeLink,
        "& path": {
          fill: theme.palette.primary.activeLink,
        }
      }
    }
  };
});
