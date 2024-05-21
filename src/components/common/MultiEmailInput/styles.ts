import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) => {
  return {
    input: {
      "&>.MuiInputBase-root": {
        height: "auto",
      },

      "&>.MuiInputBase-root.Mui-disabled": {
        backgroundColor: "transparent",
      },

      "& input": {
        padding: "0",
        minWidth: "300px",
        width: "fit-content",
        overflowX: "visible",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    },
    container: {
      backgroundColor: "transparent",
      width: "100%",
      minHeight: "50px",
      padding: "12px 14px",
      borderRadius: "6px",
      border: `1px solid  ${theme.palette.primary.border3}`,
      gap: "5px",

      "&:hover": {
        borderColor: "rgba(0, 0, 0, 0.87)",
      },

      "&.disabled": {
        backgroundColor: theme.palette.primary.disable,
      },
      "&.error": {
        borderColor: theme.palette.primary.error,
      },
    },
    placeholder: {
      color: theme.palette.primary.extraText,
    },
  };
});
