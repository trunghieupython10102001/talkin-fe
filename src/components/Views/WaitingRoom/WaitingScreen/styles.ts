import { makeStyles } from "@mui/styles";
import { QueryMapping } from "@/hooks";

export const useStyles = makeStyles((theme: Theme) => {
  const { verticalTablet, largeDesktop } = QueryMapping;

  return {
    main: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
    },
    action: {
      display: "flex",

      gap: 20,
      margin: `${theme.spacing(2)} 0px`,
      "& button": {
        width: "100%",
        fontSize: "16px",
        fontWeight: 700,
      },
    },
    cancel: {
      background: `${theme.palette.primary.cancel} !important`,
      color: `${theme.palette.primary.blue900} !important`,
    },
    container: {
      padding: "1.25rem 0",
      display: "flex",
      gap: 50,
      alignItems: "center",
    },
    videoContainer: {
      display: "block",
      width: "80%",
      margin: "0 auto",
      flex: 2,
      position: "relative",

      [verticalTablet]: {
        width: "60%",
      },
      [largeDesktop]: {
        width: "100%",
      },
    },
    right: {
      flex: 1,
      marginTop: "-50px",

      "& h1": {
        color: `${theme.palette.primary.main}`,
        fontSize: "40px",
      },
      "& h6": {
        color: `${theme.palette.primary.main}`,
        textAlign: "center",
        marginTop: "30px",
        marginBottom: "20px",
        fontSize: "18px",
      },
    },
    actions: {
      position: "absolute",
      top: ".75rem",
      left: "1rem",
      zIndex: "2",
    },
    userName: {
      color: theme.palette.primary.white,
      fontSize: "1rem",
      fontWeight: 700,
      lineHeight: "26px",
    },
    actionsContainer: {
      display: "flex",
      justifyContent: "space-between",
      position: "absolute",
      bottom: "5rem",
      left: "50%",
      transform: "translateX(-50%)",
      gap: 10,

      "& > button": {
        width: "2.625rem",
        height: "2.625rem",
        background: theme.palette.primary.gray500,
        transition: ".25s",

        "&:hover": {
          background: theme.palette.primary.extraText,
        },

        "&:disabled": {
          cursor: "not-allowed",
          pointerEvents: "auto",
        },

        "&.media-off": {
          background: theme.palette.primary.red500,
        },
      },
    },
    guestInput: {
      display: "flex",
      justifyContent: "center",
    },
  };
});
