import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useStyles } from "./styles";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { CloseIcon, MicrophoneOffPrimaryIcon, SearchIcon, UserSlashIcon } from "@/assets";
import { useParticipant } from "./hooks/useParticipant";
import { BaseDialog } from "@/components/common/base-dialog";
import classNames from "classnames";

const Users: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const classes = useStyles();
  const {
    me,
    peers,
    isOpen,
    currentPeerRemove,
    keySearch,
    avatarUrl,
    handleCancel,
    handleOpenDialogConfirmRemovePeer,
    handleConfirmRemove,
    handleMuteMicPeer,
    handleSearchParticipant,
  } = useParticipant();

  return (
    <>
      <Box component="div" height="3rem" className={classes.title}>
        <Typography component="h2" variant="h6">
          Participant list
        </Typography>
        <CloseIcon onClick={onClose} className={classes.close} />
      </Box>

      <Box className={classes.boxDrawerContent}>
        <Box component="div">
          <TextField
            margin="normal"
            fullWidth
            variant="outlined"
            placeholder="Search for people"
            name="search"
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            className={classes.search}
            onChange={(e) => handleSearchParticipant(e.target.value)}
          />
        </Box>
        <List>
          <UserItem
            isMe
            isRenderThreeDots={me.isHost}
            name={me.displayName || ""}
            peerId={me.id || ""}
            avatarUrl={avatarUrl}
            handleRemovePeer={handleOpenDialogConfirmRemovePeer}
            handleMuteMicPeer={handleMuteMicPeer}
          />
          {peers
            .filter((peer) => peer.displayName.toLowerCase().indexOf(keySearch.toLowerCase()) > -1)
            .map((peer) => (
              <UserItem
                peerId={peer.id}
                name={peer.displayName}
                avatarUrl={`${process.env.REACT_APP_BE_BASE_URL}/${peer.avatarUrl}`}
                isRenderThreeDots={me.isHost}
                handleRemovePeer={handleOpenDialogConfirmRemovePeer}
                handleMuteMicPeer={handleMuteMicPeer}
              />
            ))}
        </List>
      </Box>

      <BaseDialog open={isOpen} onClose={handleCancel} className={classes.dialog}>
        <Stack gap={4}>
          <Box component="div">
            <Typography className={classes.titleDialog}>Remove participant</Typography>
            <Typography variant="body1" className={classes.content}>
              Remove <span style={{ fontWeight: 700 }}>{currentPeerRemove.peerName}</span> from the call ?
            </Typography>
          </Box>
          <Box component="div" className={classes.btnAction}>
            <Button
              variant="contained"
              className={classNames(classes.button, classes.cancelButton)}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmRemove}
              className={classNames(classes.button, classes.removeButton)}
            >
              Remove
            </Button>
          </Box>
        </Stack>
      </BaseDialog>
    </>
  );
};

interface IUserItem {
  isMe?: boolean;
  isRenderThreeDots?: boolean;
  avatarUrl?: string;
  peerId: string;
  name: string;
  handleRemovePeer: (peerId: string, peerName: string) => void;
  handleMuteMicPeer: (peerId: string, peerName: string) => void;
}

const UserItem: React.FC<IUserItem> = ({
  isMe = false,
  isRenderThreeDots = false,
  peerId,
  name,
  avatarUrl = "",
  handleRemovePeer,
  handleMuteMicPeer,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const classes = useStyles();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const onMuteMic = (peerId: string, peerName: string) => {
    handleMuteMicPeer(peerId, peerName);
    setAnchorEl(null);
  };

  const onRemovePeer = (peerId: string, peerName: string) => {
    handleRemovePeer(peerId, peerName);
    setAnchorEl(null);
  };

  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={avatarUrl} />
        </ListItemAvatar>
        <Tooltip title={name}>
          <ListItemText
            primary={name}
            primaryTypographyProps={{
              className: classes.primaryText,
            }}
          />
        </Tooltip>
        {isRenderThreeDots && (
          <IconButton onClick={handleClick}>
            <MoreVertOutlinedIcon />
          </IconButton>
        )}
      </ListItem>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
      >
        <List>
          <ListItemButton onClick={() => onMuteMic(peerId, name)}>
            <ListItemIcon className={classes.itemIcon}>
              <MicrophoneOffPrimaryIcon />
            </ListItemIcon>
            <ListItemText
              primary="Mute"
              primaryTypographyProps={{
                className: classes.primaryText,
              }}
            />
          </ListItemButton>
          {!isMe && (
            <ListItemButton onClick={() => onRemovePeer(peerId, name)}>
              <ListItemIcon className={classes.itemIcon}>
                <UserSlashIcon />
              </ListItemIcon>
              <ListItemText
                primary="Remove"
                primaryTypographyProps={{
                  className: classes.primaryText,
                }}
              />
            </ListItemButton>
          )}
        </List>
      </Popover>
    </>
  );
};

export default Users;
