import { layoutActions } from "@/store/layoutSlice";
import { useAppDispatch, useAppSelector } from "./store";

export const useSnackbar = () => {
  const dispatch = useAppDispatch();
  const { isOpen, message, severity } = useAppSelector(
    (state) => state.layout.snackbar
  );

  const handleClose = () => {
    dispatch(
      layoutActions._closeSnackbar({
        data: { isOpen: false, message: "" },
      })
    );
  };

  return {
    isOpen,
    message,
    severity,
    handleClose,
  };
};
