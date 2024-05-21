import React from "react";
import { Dialog, DialogProps } from "@mui/material";

interface BaseDialogProps extends DialogProps {
  children: React.ReactNode;
  onClose?: () => void;

  open: boolean;
}

export const BaseDialog: React.FC<BaseDialogProps> = ({
  children,
  onClose,
  open,
  ...rest
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...rest}
    >
      {children}
    </Dialog>
  );
};
