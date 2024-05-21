import { QueryMapping } from "@/hooks";
import { makeStyles } from "@mui/styles";

export const useStyle = makeStyles((theme: Theme) => {
  return {
    buttonContainer: {
      display: "flex",
      marginTop: "60px",
      justifyContent: "space-between",
      alignItems: "flex-start",
      height: "60px",
      gap: "12px",
    },
    link: {
      color: theme.palette.primary.black,
      "& a": {
        color: theme.palette.primary.blue500,
        fontWeight: 700,
        textDecoration: "none",
        "&:hover": {
          color: theme.palette.primary.blue400,
        },
      },
    },
    input: {
      margin: `0 !important`,
    },
    button: {
      "&.MuiButton-root": {
        height: "50px",
        fontSize: "1.125rem",
        fontStyle: "normal",
        fontWeight: "800",
        lineHeight: "28px",
      },
    },
    form: {
      display: "flex",
      alignItems: "flex-start",
      gap: theme.spacing(2),
    },
    title: {
      color: theme.palette.primary.main,
      fontSize: "60px !important",
      marginBottom: "40px !important",
    },
    subTitle: {
      color: "rgb(71 85 105)",
      fontSize: "14px",
    },
  };
});

export const useStyles2 = makeStyles((theme: Theme) => {
  const mobile = QueryMapping.mobile;
  return {
    dashboardContainer: {
      width: "100%",
      color: theme.palette.primary.black,
    },
    buttonContainer: {
      display: "flex",
      marginTop: "60px",
      justifyContent: "space-between",
      alignItems: "flex-start",
      height: "60px",
      gap: "12px",
    },
    content: {
      marginTop: theme.spacing(2),
    },
    form: {
      display: "flex",
      alignItems: "flex-start",
      flex: 1,
      gap: theme.spacing(2),
    },
    input: {
      width: "100%",
      "&.MuiFormControl-root": {
        // height: "40px",
        margin: 0,
      },
    },
    boxGallery: {
      display: "flex",
      [mobile]: {
        display: "none !important",
      },
      "& img": {
        width: "50%",
        height: "auto",
        objectFit: "contain",
      },
    },
    dialog: {
      "& .MuiPaper-root": {
        borderRadius: 20,
      },
    },
    contentDialog: {
      width: "500px",
      borderRadius: 20,
      position: "relative",
      boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.2)",
      background: "white",
      padding: "50px",
    },
    header: {
      textAlign: "center",
      "& p": {
        marginTop: "16px",
        lineHeight: "26px",
        color: theme.palette.primary.main,
        marginBottom: 20,
      },
    },
    iconTitle: {},
    close: {
      position: "absolute",
      top: 20,
      right: 25,

      "&:hover": {
        cursor: "pointer",
      },
    },
    linkContent: {
      background: theme.palette.primary.bg,
      borderRadius: 10,
      padding: "20px",
      textAlign: "center",
      "& p": {
        color: theme.palette.primary.main,
        fontWeight: 700,
        wordBreak: "break-all",
      },
    },
    link: {
      color: theme.palette.primary.blue500,
      marginBottom: "15px",
      display: "inline-block",
      fontWeight: 700,
      wordBreak: "break-all",
    },
    email: {
      width: 200,
      marginRight: 20,
    },

    action: {
      display: "flex",
      marginTop: "30px",
      gap: 20,
    },
    copy: {
      "&.MuiButton-root": {
        boxShadow: "none",
        flex: 1,
        background: theme.palette.primary.cancel,
        color: theme.palette.primary.blue900,
        fontWeight: 700,
        fontSize: "1rem",
        "&:hover": {
          background: theme.palette.primary.cancel,
        },
      },
    },
    share: {
      "&.MuiButton-root": {
        boxShadow: "none",
        flex: 1,
      },
    },
    error: {
      color: "#f44336",
      display: "inline-block",
      marginTop: "12px",
      fontSize: 12,
    },
    button: {
      "&.MuiButton-root": {
        height: "50px",
        fontSize: "1.125rem",
        fontStyle: "normal",
        fontWeight: "800",
        lineHeight: "28px",
      },
    },
    title: {
      color: theme.palette.primary.main,
    },
    boxMenuItems: {
      "& .MuiMenu-paper": {
        minWidth: "270px",
      },
    },

    subtitle: {
      fontSize: "16px !important",
      marginBottom: "15px !important",
      color: "rgb(71 85 105)",
    },
  };
});
