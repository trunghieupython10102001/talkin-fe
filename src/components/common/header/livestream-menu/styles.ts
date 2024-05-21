import { makeStyles } from "@mui/styles";
export const useStyles = makeStyles((theme: Theme) => {
  return {
    livestreamMenu: {
      display: "flex",
      gap: 20,
      margin: "0 10px",
      alignItems: "center",
      "& button": {
        width: 110,
        height: 35,
        borderRadius: 30,
        fontWeight: `700 !important`,
        padding: "0 30px",
        whiteSpace: "nowrap",
      },
    },
    search: {
      margin: "0px !important",
      "& .MuiOutlinedInput-root": {
        borderRadius: 30,
        height: 35,
      },
    },
    iconSearch: {
      cursor: "pointer",
    },
    explore: {
      border: `1px solid ${theme.palette.primary.blue500} !important`,
      color: `${theme.palette.primary.blue500} !important`,

      "&:hover": {
        color: `${theme.palette.primary.white} !important`,
        background: `${theme.palette.primary.blue500} !important`,
      },
    },
    goLive: {},
    menu: {
      "& .MuiMenu-paper": {
        borderRadius: 10,
      },
    },
    menuItem: {
      height: 50,
      "&:hover": {
        background: `${theme.palette.primary.menuItem} !important`,
      },

      "& a": {
        textDecoration: "none",
        color: theme.palette.primary.main,
      },
    },
  };
});
