import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) => {
  return {
    endLive: {
      textAlign: "center",
      position: "absolute",
      top: "30%",
      color: `${theme.palette.primary.main} !important`,
      "& h4": {
        fontSize: "35px !important",
        fontWeight: "800 !important",

        margin: "30px 0",
      },
      "& p": {
        fontSize: "14px !important",
        marginBottom: "30px",
      },
      "& button": {
        fontSize: "1rem",
        backgroundColor: "unset",
        lineHeight: "26px",
        fontWeight: 700,
        width: "345px",
      },
    },

    endLiveDescription: {
      color: theme.palette.primary.black,
    },
  };
});
