import { createTheme } from "@mui/material";

export const primary = {
  primary: "#2FABDD",
  dark: "#475569",
  white: "#FFFFFF",
  extraText: "#BBBBBB",
  blue400: "#82C8EE",
  blue500: "#427EEB",
  blue900: "#0A456E",
  blue300: "#93C1D6",
  orange: "#FCB415",
  black: "#000000",
  gray500: "#D9D9D9",
  gray600: "#88888C",
  red500: "#FD1717",
  main: "#475569",
  activeLink: "#427EEB",
  border: "#979797",
  bg: "#F2F7F9",
  labelText: "#727688",
  grey93: "#EDEDED",
  error: "#DF2D2D",
  disable: "#F5F5F5",
  disable100: "#BBBBBB",
  info: "#4B74FF",
  warning: "#FFBD3C",
  success: "#67B46C",
  border2: "#F3F3F3",
  secondaryBg: "#EFF7FA",
  timePickerClock: "#021332",
  lightError: "#E86C6C",
  border1: "#CCCCCC",
  menuItem: "#EFF7FA",
  live: "#F15858",
  bg2: "#1F1D2B",
  bg3: "#F15858",
  bg4: "#F9F9F9",
  tagText: "#2D2E33",
  border3: "#B7B8BF",
  cancel: "#E9ECF6",
  border4: "#D6D6D6",
};

export type TPaletteThemeColors = typeof primary;

export const baseTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#FFFFFF",
      paper: "#fff",
    },
    primary,
  },

  typography: {
    fontFamily: '"Inter", sans-serif',

    fontSize: 14,

    allVariants: {
      lineHeight: 5 / 4,
      fontWeight: 400,
    },
  },

  components: {
    // MuiPaper: {
    //   styleOverrides: {
    //     root: {
    //       padding: "1rem",
    //     },
    //   },
    // },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: primary.labelText,
          fontWeight: 700,
          fontSize: "14px",
          "& .MuiFormLabel-asterisk": {
            color: "red",
          },
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          "&.MuiTypography-caption": {
            color: "pink",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: 12,
          marginLeft: 0,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: 50,
          borderRadius: "5px",
          "&.Mui-disabled": {
            background: primary.disable,
          },
          "&.MuiInputBase-multiline": {
            height: "100%",
          },
        },
      },
    },

    MuiDivider: {
      variants: [
        {
          props: { variant: "inset" },
          style: {
            border: "none",
            borderBottom: `1px solid ${primary.extraText}`,
            margin: "30px 0",
            width: "50%",
            "& input:focus": {
              boxShadow: "none",
            },
          },
        },

        {
          props: { variant: "fullWidth" },
          style: {
            border: "none",
            borderBottom: `1px solid ${primary.extraText}`,
            margin: "30px 0",
            "& input:focus": {
              boxShadow: "none",
            },
          },
        },
      ],
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
      variants: [
        {
          props: { variant: "contained" },
          style: {
            background: `rgb(14 165 233)`,
            color: primary.white,
            height: 40,
            textTransform: "none",
            "&.Mui-disabled": {
              background: `rgb(214 211 209)`,
              color: primary.white,
              border: "none",
            },
            "&:hover": { background: `rgb(2 132 199)` },
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            textTransform: "none",
            border: `1.5px solid ${primary.primary}`,
            color: primary.primary,
            backgroundColor: primary.white,
            "&:hover": {
              border: `1.5px solid ${primary.primary}`,
              background: primary.primary,
              color: "white",
            },
            height: 50,
            "&.Mui-disabled": {
              backgroundImage: "none",
              backgroundColor: primary.extraText,
              color: primary.white,
              borderColor: primary.extraText,
            },
          },
        },
        {
          props: { variant: "text" },
          style: {
            textTransform: "none",

            "&:hover": {
              color: primary.primary,
              background: "none",
            },
            height: 50,
            "&.Mui-disabled": { backgroundImage: "none", backgroundColor: primary.extraText, color: primary.white },
          },
        },
        {
          props: { color: "error" },
          style: {
            backgroundColor: primary.error,
            color: primary.white,
            height: 50,
            "&:hover": { backgroundColor: primary.lightError, color: primary.white },
            "&.Mui-disabled": {
              backgroundImage: `linear-gradient(to right, ${primary.extraText} , ${primary.extraText})`,
              color: primary.white,
              border: "none",
            },
          },
        },
      ],
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#fff",
          boxShadow: "none",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: 50,
          borderRadius: "5px",
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: ` ${primary.info} !important`,
              borderWidth: "1px !important",
            },
          },
        },
      },
    },

    MuiTextField: {
      variants: [
        {
          props: { variant: "filled" },
          style: {
            height: 50,
            borderRadius: 4,
            border: "1px solid #1EB6E8",
            "& input": {
              color: "#1EB6E8",
            },
          },
        },
      ],
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover, &:active": {
            backgroundColor: primary.secondaryBg,
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 500,
      md: 768,
      lg: 1200 + 48, // content's width + padding left + padding + right
      xl: 1440,
    },
  },
});
