import { Provider } from "react-redux";
import { store } from "store";
import { ThemeProvider } from "@mui/material";
import { router } from "routes";
import { RouterProvider } from "react-router-dom";
import { baseTheme } from "themes";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "styles.css";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={baseTheme}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <CssBaseline />
          <RouterProvider router={router} />
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
