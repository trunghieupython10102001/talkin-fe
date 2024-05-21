import { createStyles } from "@mui/styles";

export const styles = (theme: Theme) =>
  createStyles({
    peerView: {
      height: "100%",
      position: "relative",
      boxShadow: theme.shadows[11],
    },
    peerDisableVideo: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: theme.shadows[11],
      borderRadius: theme.shape.borderRadius,
    },
    groupInfo: {
      left: "18px",
      bottom: "18px",
      position: "absolute",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    wrapperBoxSound: {},
    wrapperDisplayName: {
      maxWidth: "50%",
      color: theme.palette.common.white,
      fontSize: "16px",
      fontWeight: 700,
      padding: "8px",
    },
    you: {
      minWidth: "50px",
    },
    displayName: {
      display: "inline-block",
      "-webkit-line-clamp": 1,
      "-webkit-box-orient": "vertical",
      width: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      minWidth: "80px",
    },
    videoElement: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transform: "scaleX(-1)",
      WebkitTransform: "scaleX(-1)",
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[11],
    },
    audioElement: {
      display: "none",
      position: "absolute",
    },
    browserPreventModal: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "#0008",
      zIndex: 10,
      top: 0,
      left: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      "& > div": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        flexDirection: "column",

        "&>.MuiButton-root": {
          minWidth: "250px",
        },

        "&>p": {
          color: theme.palette.primary.white,
        },
      },
    },
    peerPin: {
      "&:hover": {
        "& .pinIcon": {
          width: "100px",
          display: "flex !important",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderRadius: "60px",
        },
        "&:after": {
          content: "''", // :before and :after both require content
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.5,
        },
      },
      "& .pinIcon": {
        display: "none",
        position: "absolute",
        top: "47%",
        zIndex: 5,
        left: 0,
        right: 0,
        margin: "0 auto",
        "& svg": {
          fill: theme.palette.common.white,
        },
      },
    },
  });
