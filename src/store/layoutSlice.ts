import { ISnackbar } from "@/interfaces/type";
import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ILayoutState {
  snackbar: ISnackbar;
}

const initialState: ILayoutState = {
  snackbar: {
    isOpen: false,
    message: "",
    severity: "success",
  },
};

const _openSnackbar: CaseReducer<
  ILayoutState,
  PayloadAction<{ data: ISnackbar }>
> = (state, action) => {
  state.snackbar = {
    ...state.snackbar,
    ...action.payload.data,
  };
};

const _closeSnackbar: CaseReducer<
  ILayoutState,
  PayloadAction<{ data: ISnackbar }>
> = (state, action) => {
  state.snackbar = {
    ...state.snackbar,
    ...action.payload.data,
  };
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    _openSnackbar,
    _closeSnackbar,
  },
});

export const layoutActions = layoutSlice.actions;
export const layoutAsyncActions = {};

export default layoutSlice.reducer;
