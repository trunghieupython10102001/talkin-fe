import { Button, Typography } from "@mui/material";
import { BaseDialog } from "../base-dialog";
import { useStyles } from "./styles";

interface ConfirmEmailProps {
  isOpen: boolean;
  title?: string;
  content?: string;
  onClose: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}
const ConfirmEmail: React.FC<ConfirmEmailProps> = ({
  isOpen,
  title = "Send invitation email",
  content,
  onCancel,
  onSubmit,
  onClose,
}) => {
  const classes = useStyles();
  return (
    <BaseDialog open={isOpen} onClose={onClose} className={classes.dialog}>
      <div className={classes.sendMail}>
        <Typography className={classes.title}> {title}</Typography>
        <Typography variant="body1" className={classes.content}>
          {content}
        </Typography>
      </div>
      <div className={classes.btnAction}>
        <Button variant="contained" onClick={onCancel} className={classes.cancel}>
          No
        </Button>
        <Button variant="contained" onClick={onSubmit}>
          Yes
        </Button>
      </div>
    </BaseDialog>
  );
};
export default ConfirmEmail;
