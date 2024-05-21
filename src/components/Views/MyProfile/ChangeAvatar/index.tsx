import { useStyles } from "./styles";
import { DialogContent, DialogTitle, IconButton, Avatar, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useChangeAvatar } from "./useChangeAvatar";
import { IProfile } from "@/interfaces/type";
import { BaseDialog } from "@/components/common/base-dialog";

interface ChangeAvatarProps {
  isOpen: boolean;
  onClose?: () => void;
  avatarURL?: string;
  profileData?: IProfile;
  handleGetProfile?: () => void;
}
export default function ChangeAvatar({ isOpen, onClose, avatarURL, profileData, handleGetProfile }: ChangeAvatarProps) {
  const classes = useStyles();
  const { onSelectFile, preview, error, handleUploadAvatar, imgAvatar } = useChangeAvatar(
    isOpen,
    onClose,
    avatarURL,
    handleGetProfile
  );

  return (
    <div className={classes.changeAvatar}>
      <BaseDialog open={isOpen}>
        <div className={classes.contentDialog}>
          <DialogTitle>
            <div className={classes.title}>
              <div></div>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </DialogTitle>

          <DialogContent>
            <Avatar alt="Avatar" src={imgAvatar} className={classes.avatar}>
              {avatarURL ? "" : `${profileData?.firstname.charAt(0)}${profileData?.lastname.charAt(0)}`}
            </Avatar>
            {error && <span className={classes.error}>{error}</span>}
          </DialogContent>

          <div className={classes.actions}>
            <input type="file" id="upload-file" onChange={onSelectFile} className={classes.inputFile} />
            <Button variant="outlined" component="label" className={classes.btnUpload} htmlFor="upload-file">
              Upload from computer
            </Button>
            <Button className={classes.btnSave} variant="contained" disabled={Boolean(!preview)} onClick={handleUploadAvatar}>
              Save
            </Button>
          </div>
        </div>
      </BaseDialog>
    </div>
  );
}
