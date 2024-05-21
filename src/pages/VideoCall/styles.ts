import { makeStyles } from "@mui/styles";
import { QueryMapping } from "@/hooks";

export const useStyles = makeStyles((theme: Theme) => {
  const mobile = QueryMapping.mobile;
  return {
    "@global": {
      "@keyframes show": {
        "0%": {
          opacity: 0,
          transform: "scale(0.4) translateY(20px)",
        },

        "100%": {
          opacity: 1,
          transform: "scale(1) translateY(0)",
        },
      },
    },
    main: {
      position: "relative",
      minHeight: "100vh",
      background: theme.palette.primary.main,
    },
    wrapperMainScreen: {
      position: "fixed",
      width: "100%",
      height: "calc(100% - 5rem)",
      display: "flex",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    listPeer: {
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      alignItems: "center",
      verticalAlign: "middle",
      flex: "1 1 auto",
      "& > div": {
        animation: "$show 0.1s ease",
      },
    },
    peerPin: {
      animation: "$show 0.1s ease",
      flex: "2 1 auto",
      padding: "10px",
    },
    peerOther: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: theme.spacing(1),
      boxShadow:
        "0px 6px 7px -4px rgba(0,0,0,0.2), 0px 11px 15px 1px rgba(0,0,0,0.14), 0px 4px 20px 3px rgba(0,0,0,0.12)",

      "& .title": {
        color: theme.palette.common.white,
      },
    },
    action: {
      width: "100%",
      height: "5rem",
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: theme.palette.primary.main,
    },
    actionLeftRight: {
      display: "flex",
      [mobile]: {
        display: "none !important",
      },
    },

    actionRight: {
      "& .MuiBadge-badge": {
        background: "transparent",
        color: theme.palette.common.white,
      },
    },

    actionRightActive: {
      color: theme.palette.primary.primary,
      "& .MuiBadge-badge": {
        color: theme.palette.primary.primary,
      },
      "& svg": {
        fill: theme.palette.primary.primary,
        "& path": {
          fill: theme.palette.primary.primary,
        },
      },
    },

    meetingName: {
      color: theme.palette.common.white,
      "& h1": {
        fontSize: "22px !important",
        fontWeight: 700,
      },
      "& div:last-child": {
        color: theme.palette.common.white,
        padding: 0,
        border: "none",
        "& h6": {
          color: theme.palette.common.white,
          fontSize: "14px !important",
        },
      },
    },

    actionCenter: {
      display: "flex",
      justifyContent: "space-between",
      gap: "0.4rem",
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
      "& .end-call": {
        width: "4.125rem",
        borderRadius: "1.3125rem",
        background: theme.palette.primary.red500,
      },
    },

    boxDrawer: {
      height: "calc(100% - 2rem)",
      "& .MuiPaper-root": {
        height: "100%",
        "& .MuiCardContent-root": {
          height: "100%",
        },
      },
    },
    dialogLeave: {
      "& .MuiDialog-paper": {
        borderRadius: 20,
      },
    },
    leaveRoom: {
      padding: "50px 40px 0px",
    },
    title: {
      textAlign: "center",
      fontSize: "22px !important",
      fontWeight: "700 !important",
      color: `${theme.palette.primary.main}`,
    },
    content: {
      color: `${theme.palette.primary.main} !important`,
      marginTop: "20px !important",
    },
    btnAction: {
      display: "flex",
      justifyContent: "space-between",
      padding: "30px 40px 50px",
      gap: 20,
      "& button": {
        flex: 1,
        borderRadius: 8,
        fontSize: "16px !important",
      },
    },
    cancel: {
      background: `${theme.palette.primary.disable100} !important`,
    },

    boxSettings: {
      "& .MuiListItem-root": {
        padding: 0,
      },
      "& .MuiButtonBase-root:hover": {
        backgroundColor: theme.palette.primary.secondaryBg,
      },
      "& .MuiListItemIcon-root": {
        minWidth: "unset",
        marginRight: "10px",
      },
      "& .MuiListItemText-root": {
        color: theme.palette.primary.main,
      },
    },
    stopRecording: {
      minWidth: "fit-content",
      height: 42,
      padding: "18px !important",
      borderRadius: `21px !important`,
      "& p": {
        color: `${theme.palette.primary.main}`,
        marginLeft: 10,
      },
      "&.Mui-disabled": {
        background: `${theme.palette.primary.disable100} !important`,
      },
    },

    headerShare: {
      display: "flex",
      justifyContent: "space-between",
      background: theme.palette.primary.blue900,
      alignItems: "center",
      height: "40px",
      padding: "10px",
      color: theme.palette.primary.white,
      margin: "35px",
      borderRadius: "5px",
      position: "absolute",

      "& button": {
        fontSize: "16px",
        color: theme.palette.primary.white,
      },
    },
    dFlex: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    videoElement: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[11],
    },
  };
});
