import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) => {
  return {
    changeAvatar: {},
    title: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    contentDialog: {
      width: 500,
      height: "fit-content",
    },
    avatar: {
      width: `110px !important`,
      height: `110px !important`,
      margin: `0 auto`,
    },
    actions: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "1.875rem 0",
      gap: "1.875rem",
    },
    inputFile: {
      display: "none",
    },
    btnUpload: {
      width: "40%",
      border: `1px solid ${theme.palette.primary.blue500}`,
      borderRadius: "8px !important",
      color: theme.palette.primary.blue500,
      fontWeight: 700,
      "&:hover": {
        cursor: "pointer",
        background: "rgba(66, 126, 235, 0.30)",
        color: theme.palette.primary.blue500,
      },
    },
    btnSave: {
      width: "40%",
      borderRadius: "8px !important",
      fontWeight: 700,
    },
    error: {
      color: theme.palette.primary.error,
      marginTop: "20px",
      display: "block",
      textAlign: "center",
    },
  };
});
