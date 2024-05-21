import { makeStyles } from "@mui/styles";
import { QueryMapping } from "@/hooks/use-breakpoint";

export const useStyle1 = makeStyles((theme: Theme) => {
  const { mobile, tablet } = QueryMapping;

  return {
    layoutContainer: {
      display: "flex",
      flexDirection: "row",
      gap: 154,
      "& > div": {
        flex: 1,
      },
      marginTop: 106,
      [tablet]: {
        marginTop: 20,
      },
    },
    boxGallery: {
      [mobile]: {
        display: "none !important",
      },
      "& img": {
        maxWidth: "100%",
        height: "auto",
      },
    },
  };
});

export const useStyles2 = makeStyles((theme: Theme) => {
  return {
    defaulRoot: {
      display: "flex",
      flexDirection: "column",
      flex: "1 1 auto",
    },
    wrapperMain: {
      flex: 1,
      marginBottom: theme.spacing(4),
    },
    footerContainer: {
      maxHeight: 68,
    },
    divider: {
      "&.MuiDivider-root": {
        margin: 0,
      },
    },
  };
});
