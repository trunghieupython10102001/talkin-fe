import { makeStyles } from "@mui/styles";
export const useStyles = makeStyles((theme: Theme) => {
  return {
    profileContainer: {
      marginTop: theme.spacing(4),
      padding: "30px 50px 48px 50px",
      height: "100%",
      maxWidth: "1000px",
      margin: "0 auto",
      position: "relative",

      "&.MuiPaper-root": {
        boxShadow: "0px 10px 50px 0px rgba(0, 0, 0, 0.10)",
      },

      "& .Mui-required+div": {
        minHeight: "75px",

        "&> .MuiFormHelperText-root": {
          marginTop: "0.5rem",
        },
      },

      "& .MuiGrid-root.MuiGrid-item": {
        paddingTop: 0,
      },

      "& h5": {
        color: theme.palette.primary.main,
        fontSize: "28px",
        fontWeight: 700,
      },
    },
    headPage: {
      display: "flex",
    },
    avatar: {
      position: "relative",
      width: "max-content",
      "& > svg": {
        position: "absolute",
        bottom: 0,
        right: 0,
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
      "& > div > div": {
        flex: 1,
      },
      "& > div > button": {
        flex: 1,
      },
    },

    closeButton: {
      "&.MuiIconButton-root": {
        position: "absolute",
        top: "10px",
        right: "10px",
        width: "1.5rem",
        height: "1.5rem",
      },
    },

    button: {
      "&.MuiButton-root": {
        fontWeight: 700,
        fontSize: "1rem",
        lineHeight: "26px",
      },
    },

    groupButton: {
      display: "flex",
      flexDirection: "row",
      gap: theme.spacing(3.75),

      "&.MuiGrid-root": {
        marginTop: "30px",
      },
    },
    editButton: {
      display: "flex",
      justifyContent: "center",

      "& .MuiButtonBase-root": {
        maxWidth: 345,
      },
    },

    meetingTypeDropdown: {
      "&.MuiInputBase-root": {
        width: "100%",
        flex: "none",
      },
      "&>.MuiSelect-nativeInput": {
        height: "100%",
        display: "none",
      },
      "&>.MuiSelect-select.MuiInputBase-input": {
        padding: 0,
        paddingLeft: "14px",
        height: "100%",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
      },
    },

    selectDropdownContainer: {
      "& .MuiMenuItem-root.Mui-selected": {
        fontWeight: 700,
      },
    },
    emailTag: {
      "&.MuiChip-root": {
        height: "auto",
        borderRadius: "4px",
        border: `1px solid  ${theme.palette.primary.border3}`,
        background: theme.palette.primary.grey93,
        padding: "6px 10px",
        gap: "10px",
        alignItems: "center",

        "&>.MuiSvgIcon-root": {
          background: "transparent",
          color: "#727688",
        },
      },

      "&> .MuiChip-label": {
        padding: 0,
      },

      "& .MuiIconButton-root.MuiChip-deleteIcon": {
        margin: 0,
        padding: 0,
        "& > svg": {
          width: "0.75rem",
          height: "0.75rem",
        },
      },
    },

    timePicker: {
      maxWidth: "max-content",
      boxShadow: "0px 4px 30px 0px rgba(0, 0, 0, 0.30)",
      borderRadius: "24px",
      padding: "15px 30px 30px 30px",

      "&>.MuiPickersLayout-contentWrapper": {
        marginBottom: "20px",
      },

      "& .MuiPickersArrowSwitcher-root": {
        display: "none",
      },

      "& .MuiClock-clock": {
        position: "relative",
        outline: `1px solid ${theme.palette.primary.extraText}`,
        outlineOffset: "8px",
        background: theme.palette.primary.timePickerClock,

        "& .MuiClockNumber-root": {
          color: theme.palette.primary.white,
          zIndex: 2,
        },

        "& .MuiClockPointer-root, & .MuiClockPointer-thumb, & .MuiClock-pin": {
          backgroundColor: theme.palette.primary.blue500,
          borderColor: theme.palette.primary.blue500,
          zIndex: 1,
        },

        "&::after": {
          content: '" "',
          position: "absolute",
          width: "123px",
          height: "123px",
          backgroundColor: theme.palette.primary.main,
          // zIndex: "-1",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "999999px",
        },

        "&~.MuiButtonBase-root": {
          backgroundColor: theme.palette.primary.extraText,
          width: "42px",
          height: "42px",

          "&>.MuiTypography-root": {
            fontWeight: "700",
            color: theme.palette.primary.white,
          },
        },
      },

      "&>.MuiDialogActions-root": {
        "&>.MuiButtonBase-root": {
          width: "100%",
          height: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          background: "linear-gradient(270deg, #2F9EDD 0%, #427EEB 100%)",
          color: theme.palette.primary.white,
          fontSize: "1rem",
          fontWeight: "700",
        },
      },
    },
    timePickerToolbar: {
      "&>.MuiTypography-root": {
        display: "none",
      },
      "&>.MuiGrid-root": {
        justifyContent: "center",
      },
    },
    timePickerActivingAM: {
      "& .MuiPickersLayout-contentWrapper>.MuiTimeClock-root>.MuiClock-root": {
        "&>.MuiButtonBase-root": {
          "&:first-of-type": {
            backgroundColor: theme.palette.primary.blue500,
          },
        },
      },
    },
    timePickerActivingPM: {
      "& .MuiPickersLayout-contentWrapper>.MuiTimeClock-root>.MuiClock-root": {
        "&>.MuiButtonBase-root": {
          "&:last-of-type": {
            backgroundColor: theme.palette.primary.blue500,
          },
        },
      },
    },
    cancelButton: {
      "&.MuiButtonBase-root": {
        backgroundImage: "none",
        background: theme.palette.primary.cancel,
        color: theme.palette.primary.blue900,
        boxShadow: "none",
        "&:hover": {
          background: theme.palette.primary.cancel,
        },
      },
    },
    removeButton: {
      "&.MuiButtonBase-root": {
        backgroundImage: "none",
        background: theme.palette.primary.error,
        "&:hover": {
          background: theme.palette.primary.lightError,
        },
      },
    },
    detailSchedule: {
      display: "flex",
      justifyContent: "space-between",
      "& a": {
        color: theme.palette.primary.activeLink,
        lineHeight: "26px",
        textDecoration: "underline",
      },
      "& strong": {
        color: theme.palette.primary.labelText,
      },

      "&>p": {
        margin: "1rem 0 0",
        color: theme.palette.primary.dark,
      },
    },
    subTitle: {
      textAlign: "center",
      marginTop: "30px",
      color: theme.palette.primary.main,
    },
  };
});
