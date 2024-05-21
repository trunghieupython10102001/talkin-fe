import { makeStyles } from "@mui/styles";
import { QueryMapping } from "hooks/use-breakpoint";

export const useStyles = makeStyles((theme: Theme) => {
  const mobile = QueryMapping.mobile;
  const desktop = QueryMapping.desktop;

  return {
    headerContainer: {
      "&.MuiAppBar-root": {
        boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.05)",
      },
      padding: "10px",
    },
    main: {},
    logoContainer: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
      textDecoration: "none !important",
      "&.MuiTypography-root": {
        textDecoration: "none !important",
      },
    },
    logo: {
      display: "flex",
      borderRadius: "50%",
      overflow: "hidden",
      height: "60px",
      [mobile]: {
        display: "none !important",
      },

      "& svg": {
        height: "100%",
      },
    },
    siteName: {
      marginRight: theme.spacing(2),
      fontWeight: 700,
      color: theme.palette.primary.dark,
      textDecoration: "none",
    },
    siteNameMobile: {
      display: "flex",
      flexGrow: 1,
      [desktop]: {
        display: "none !important",
      },
    },
    siteNameDesktop: {
      display: "flex",
      [mobile]: {
        display: "none !important",
      },
    },
    menuDesktop: {
      flexGrow: 1,
      marginRight: "30px",

      [mobile]: {
        display: "none !important",
      },

      "& > .container": {
        display: "flex",
        justifyContent: "flex-end",
        gap: "1.875rem",
        minWidth: "472px",
        width: "fit-content",
        marginLeft: "auto",
      },

      "& a": {
        textDecoration: "none",
      },
      "& button": {
        fontSize: "1rem",
        fontWeight: "700",
        padding: "0",
      },
      "& a.active button": {
        color: theme.palette.primary.dark,
      },
    },
    menuMobile: {
      "& a": {
        textDecoration: "none",
        color: theme.palette.primary.dark,
      },
      "& a.active p": {
        color: theme.palette.primary.dark,
      },
    },
    avatar: {
      marginLeft: "30px",
    },
    dropdownMenu: {
      "&.MuiMenu-paper": {
        minWidth: "120px",
      },
    },
  };
});
