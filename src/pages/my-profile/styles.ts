import { makeStyles } from "@mui/styles";
export const useStyles = makeStyles((theme: Theme) => {
  return {
    profileContainer: {
      padding: "0px 50px 48px 50px",
      height: "100%",
      maxWidth: "1000px",
      margin: "0 auto",
      marginTop: 165,
    },
    headPage: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      "& button": {
        fontSize: "16px !important",
        fontWeight: "700 !important",
        width: 187,
        borderRadius: 8,
      },
    },
    titlePage: {
      paddingRight: "40px",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& h6": {
        color: theme.palette.primary.main,
      },
    },
    avatar: {
      position: "relative",
      width: "max-content",
      display: "flex",
      alignItems: "center",
      gap: 20,
    },

    avatarContainer: {
      position: "relative",
      "& > svg": {
        position: "absolute",
        bottom: 8,
        right: "0%",
        cursor: "pointer",
      },
    },

    formContainer: {
      paddingTop: theme.spacing(3),
      "& > div:not(:last-child)": {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: theme.spacing(0.5),
      },
      "& > div > label": {
        minWidth: "100px",
        color: theme.palette.primary.labelText,
        fontWeight: 700,
        fontSize: 14,
      },
      // "& > div > div": {
      //   flex: 1,
      // },
      "& > div > button": {
        flex: 1,
      },
    },
    groupButton: {
      display: "flex",
      flexDirection: "row",
      gap: theme.spacing(3.75),
    },
    editButton: {
      display: "flex",
      justifyContent: "center",
      "& .MuiButtonBase-root": {
        maxWidth: 345,
      },
    },
    info: {
      "& h6": {
        fontSize: "22px !important",
        fontWeight: "700 !important",
      },
    },
    birthday: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    gender: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    summaryInfo: {
      display: "flex",
      alignItems: "center",
      gap: 10,

      "& > button": {
        width: "fit-content !important",
        height: "auto",
      },
    },
    cancel: {
      background: `${theme.palette.primary.disable100} !important`,
    },
    error: {
      color: theme.palette.primary.error,
      fontSize: "12px !important",
    },
    bgProfile: {
      position: "absolute",
      left: "calc((100vw - 100%) / 2 * -1)",
      width: "100%",
      "& img": {
        width: "100%",
        height: 180,
        objectFit: "cover",
      },
    },
    title: {
      position: "absolute",
      top: "50%",
      left: "50%",
      color: theme.palette.primary.white,
      transform: `translate(-50%, -50%)`,
      fontSize: "35px !important",
      fontWeight: `800 !important`,
    },
  };
});
