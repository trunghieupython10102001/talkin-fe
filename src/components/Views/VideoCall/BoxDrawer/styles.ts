import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) => {
  return {
    boxDrawerContent: {
      height: "calc(100% - 3rem)",
      position: "relative",
      overflowY: "scroll",

      color: theme.palette.primary.main,
      "&::-webkit-scrollbar": {
        width: "0.1em",
      },
      "&::-webkit-scrollbar-track": {
        boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.00)",
        webkitBoxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.00)",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0, 0, 0, .1)",
        outline: `1px solid ${theme.palette.divider}`,
      },

      "& h6": {
        wordBreak: "break-all",
      },
    },
    listMessages: {
      height: "calc(100% - 3rem)",
      overflowY: "scroll",
      "&::-webkit-scrollbar": {
        width: "0.1em",
      },
      "&::-webkit-scrollbar-track": {
        boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.00)",
        webkitBoxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.00)",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0, 0, 0, .1)",
        outline: `1px solid ${theme.palette.divider}`,
      },
      "& .MuiListItem-root": {
        display: "inline-block",
      },
    },
    displayName: {
      fontWeight: 700,
    },
    title: {
      display: "flex",
      justifyContent: "space-between",
      "& h2": {
        fontSize: "22px",
        color: theme.palette.primary.main,
        fontWeight: 700,
      },
    },
    close: {
      "&:hover": {
        cursor: "pointer",
      },
    },
    link: {
      color: theme.palette.primary.blue500,
      wordBreak: "break-all",
    },
    btnCopy: {
      color: `${theme.palette.primary.blue500} !important`,
      border: `1px solid rgba(10, 69, 110, 0.2) !important`,
      "&:hover": {
        color: `${theme.palette.primary.white} !important`,
        background: `${theme.palette.primary.blue500} !important`,
      },
      borderRadius: "10px !important",
      marginTop: "16px !important",
    },
    search: {
      "& .MuiInputBase-root": {
        borderRadius: "0.625rem",
      },
    },

    dialog: {
      "& .MuiDialog-paper": {
        borderRadius: 20,
        padding: "50px 40px",
        minWidth: "26.5rem",
      },
    },

    titleDialog: {
      textAlign: "center",
      fontSize: "22px !important",
      fontWeight: "700 !important",
      color: `${theme.palette.primary.main}`,
    },
    content: {
      color: `${theme.palette.primary.main} !important`,
      marginTop: "20px !important",
      textAlign: "center",
    },
    btnAction: {
      display: "flex",
      justifyContent: "space-between",
      gap: 20,
      "& button": {
        flex: 1,
        borderRadius: 8,
        fontSize: "16px !important",
      },
    },
    button: {
      "&.MuiButton-root": {
        fontWeight: 700,
        fontSize: "1rem",
      },
    },
    cancelButton: {
      "&.MuiButtonBase-root": {
        backgroundImage: "none",
        background: theme.palette.primary.cancel,
        color: theme.palette.primary.blue900,
        "&:hover": {
          background: theme.palette.primary.cancel,
        },
      },
    },
    removeButton: {
      "&.MuiButtonBase-root": {
        color: theme.palette.common.white,
        backgroundImage: "none",
        background: theme.palette.primary.error,
        "&:hover": {
          background: theme.palette.primary.lightError,
        },
      },
    },

    itemIcon: {
      minWidth: "42px !important",
    },

    primaryText: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      color: theme.palette.primary.main,
    },
    stopRecording: {
      background: `${theme.palette.primary.error} !important`,
    },
  };
});
