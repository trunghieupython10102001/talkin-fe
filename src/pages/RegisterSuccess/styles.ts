import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) => {
  return {
    link: {
      color: theme.palette.primary.blue500,
    },
    mainContent: {
      color: theme.palette.primary.main,
      margin: "30px 0 !important",
      fontSize: "35px !important",
    },
    content: {
      color: theme.palette.primary.black,
      fontSize: "14px",
    },
  };
});
