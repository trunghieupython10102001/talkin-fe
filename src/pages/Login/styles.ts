import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) => {
  return {
    signinContainer: {
      "&.MuiPaper-root": {
        borderRadius: 15,
        boxShadow: "0px 10px 50px 0px rgba(0, 0, 0, 0.10)",
      },
      "& .MuiCardContent-root": {
        padding: "55px 65px 70px 65px !important",
      },
    },
    use: {
      fontSize: "14px !important",
      color: theme.palette.primary.black,
      marginTop: "10px !important",
      textAlign: "center",
    },
    title: {
      fontSize: "28px !important",
      color: theme.palette.primary.main,
    },
    forget: {
      fontSize: "14px !important",
      color: theme.palette.primary.black,
      marginTop: "14px !important",
      marginBottom: "16px !important",
      "& a": {
        color: theme.palette.primary.blue500,
        "&:hover": {
          color: theme.palette.primary.blue400,
        },
      },
    },
    signInMetamaskBtn: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      "&>svg": {
        width: "1.5rem",
        height: "1.5rem",
      },
    },
  };
});
