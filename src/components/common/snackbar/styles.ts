import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) => {
  return {
    container: {
      position: "fixed",
      top: "0",
      right: "0",
      padding: "1rem",
    },
    notification: {
      "&.MuiSnackbar-root": {
        position: "static",
        boxShadow: "0px 4px 30px 0px rgba(0, 0, 0, 0.30)",
        borderRadius: "15px",
      },

      "&.error": {
        "& .MuiAlert-root ": {
          background: theme.palette.primary.error,
          color: theme.palette.primary.white,
          maxWidth: 300,
        },
      },
      "&.info": {
        "& .MuiAlert-root ": {
          background: theme.palette.primary.success,
          color: theme.palette.primary.white,
          maxWidth: 300,
        },
      },
      "&.join": {
        "& .MuiAlert-root ": {
          background: theme.palette.primary.white,
          color: theme.palette.primary.main,
          borderRadius: 10,
          maxWidth: 300,
        },
      },
      "&.message": {
        "& .MuiAlert-root ": {
          background: theme.palette.primary.white,
          color: theme.palette.primary.main,
          borderRadius: 10,
          maxWidth: 300,
          position: "fixed",
          bottom: "8%",
        },
      },
    },
    toastMsg: {
      "& .MuiAlert-message ": {
        display: "flex",
        alignItems: "center",
        gap: 10,
      },
    },
    toastRemove: {
      background: `${theme.palette.common.white} !important`,
      color: `${theme.palette.primary.main} !important`,
      "& svg path": {
        fill: `${theme.palette.primary.error} !important`,
      },
    },
    recording: {
      background: `${theme.palette.common.white} !important`,
      color: `${theme.palette.primary.main} !important`,
    },
    content: {
      overflow: "hidden",
      flex: 1,
    },
    text: {
      display: "-webkit-box",
      maxWidth: "300px",
      "-webkit-line-clamp": 3,
      "-webkit-box-orient": "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  };
});
