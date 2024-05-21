import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) => {
  return {
    sendMail: {
      padding: "30px 40px 0px",
    },

    dialog: {
      "& .MuiDialog-paper": {
        borderRadius: 20,
      },
    },

    title: {
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
      padding: "30px 40px 50px",
      gap: 20,
      "& button": {
        flex: 1,
        borderRadius: 8,
        fontSize: "1rem",
        fontWeight: 700,
        lineHeight: "26px",
        backgroundColor: "unset",
      },
    },
    cancel: {
      "&.MuiButton-root": {
        background: theme.palette.primary.cancel,
        boxShadow: "none",
        color: theme.palette.primary.blue900,

        "&:hover": {
          background: theme.palette.primary.cancel,
        },
      },
    },
  };
});
