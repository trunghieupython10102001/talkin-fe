import { makeStyles } from "@mui/styles";
import { QueryMapping } from "@/hooks";

export const useStyles = makeStyles((theme: Theme) => {
  const mobile = QueryMapping.mobile;
  return {
    wrapperVideo: {
      position: "relative",
      width: "fit-content",
      margin: "0 auto",
    },
    displayName: {
      position: "absolute",
      zIndex: 1,
      left: "1rem",
      top: "1rem",
      color: theme.palette.primary.white,
    },
    videoStyles: {
      borderRadius: ".625rem",
      backgroundColor: theme.palette.primary.dark,
      width: "50rem",
      height: "28.125rem",
      transform: "scaleX(-1)",
      WebkitTransform: "scaleX(-1)",
    },

    hidden: {
      display: "none",
    },

    box: {
      minWidth: "20rem",
      [mobile]: {
        minWidth: "15rem !important",
      },

      "& .MuiListItem-root": {
        padding: 0,

        "&.item-list": {
          "& .MuiListItemIcon-root": {
            opacity: 0,
          },
          "&.active": {
            "& .MuiListItemIcon-root": {
              opacity: 1,
            },
          },
        },

        "&.active": {
          color: theme.palette.primary.blue500,
        },

        "&:last-child": {
          borderTop: `1px solid ${theme.palette.primary.extraText}`,
        },

        "&>.MuiButtonBase-root": {
          padding: "7px 1.25rem",
        },

        "& .MuiListItemIcon-root": {
          minWidth: "unset",
          marginRight: "5px",
        },
      },
    },

    boxMics: {},

    boxSpeakers: {},

    boxCameras: {},

    mediaControls: {
      "& > svg": {
        marginRight: "5px",
        transition: "all .5s",

        "&.down": {
          transform: "rotate(180deg)",
        },
      },
      "& > .text": {
        maxWidth: "126px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },

    volumnContainer: {
      pointerEvents: "none",
      background: theme.palette.divider,
      "& > .bar": {
        height: "6px",
        borderRadius: "6px",
        backgroundColor: theme.palette.info.main,
        transitionProperty: "width background-color",
        transitionDuration: "0.25s",
      },
    },

    wrapperBoxSound: {
      position: "absolute",
      top: "1rem",
      right: "1rem",
    }
  };
});
