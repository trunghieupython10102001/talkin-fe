import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) => {
  return {
    signupContainer: {
      "&.MuiPaper-root": {
        borderRadius: 15,
        boxShadow: "0px 10px 50px 0px rgba(0, 0, 0, 0.10)",
      },
      "& .MuiCardContent-root": {
        padding: "55px 65px 70px 65px !important",
      },
    },
    title: {
      fontSize: "28px !important",
      color: theme.palette.primary.main,
      marginBottom: "40px",
    },
    use: {
      fontSize: "14px !important",
      color: theme.palette.primary.black,
      marginTop: "10px !important",
      textAlign: "center",
    },
  };
});
