import { BaseDialog } from "@/components/common/base-dialog";
import { Typography, Button } from "@mui/material";
import React from "react";
import { useStyles } from "./styles";

interface IConsensusDialogProps {
  title: string;
  content: string;
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
  submitLabel: string;
}

export const RecordingDialog: React.FC<IConsensusDialogProps> = ({
  title,
  content,
  isOpen,
  onSubmit,
  onClose,
  submitLabel,
}) => {
  const classes = useStyles();
  return (
    // eslint-disable-next-line react/jsx-no-undef
    <BaseDialog open={isOpen} onClose={onClose} className={classes.dialog}>
      <div className={classes.consensus}>
        <Typography className={classes.titleDialog}>{title} </Typography>
        <Typography variant="body1" className={classes.content}>
          {content}
        </Typography>
      </div>
      <div className={classes.btnAction}>
        <Button variant="contained" onClick={onClose} className={classes.cancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </BaseDialog>
  );
};
