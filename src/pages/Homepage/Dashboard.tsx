import React, { useState } from "react";
import {
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  Stack,
  Box,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { useStyles2 } from "./styles";
import { BaseDialog } from "components/common/base-dialog";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useInvite } from "@/hooks/use-invite";
import { useAppSelector } from "@/hooks";
import { NavLink, useNavigate, generatePath } from "react-router-dom";
import { REGEX } from "@/constants/regex";
import { VideoPlus, CopyIcon, NetWorkIcon, CloseIcon, ShareIcon, PlusIcon, LinkHorizontalIcon } from "@/assets";
import { MESSAGE } from "@/constants/message";
import { Paths } from "@/constants/path";

const Dashboard: React.FC = () => {
  const classes = useStyles2();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const roomId = useAppSelector((state) => state.invite.roomId);
  const { createInviteLink, joinMeeting } = useInvite();
  const location = window.location.origin;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickNewMeetingBtn = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeAddMeetingPopup = () => {
    setAnchorEl(null);
  };

  const [linkCopy, setLinkToClipBoard] = useState({
    value: "",
    copy: false,
    error: "",
  });

  const hanldeCreateMeeting = () => {
    setOpen(true);
    createInviteLink();
  };

  const handleJoinMeeting = () => {
    joinMeeting(linkCopy.value);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setLinkToClipBoard((pre) => ({ ...pre, value: e.target.value.trim(), error: "" }));
  };

  const handleOpenShare = () => {
    setOpenShare(true);
  };

  const handleOnCopy = () => {
    setLinkToClipBoard((pre) => ({ ...pre, copy: true }));
    setTimeout(() => {
      setLinkToClipBoard((pre) => ({ ...pre, copy: false }));
    }, 1000);
  };

  const contentCopy = () => {
    return `${location}/waiting-room/${roomId}`;
  };

  const handleBlur = () => {
    const ruleName = REGEX.ONLY_NUMBER_CHARACTERS_SPACE;
    if (linkCopy.value.trim() === "") {
      setLinkToClipBoard((pre) => ({ ...pre, error: MESSAGE.MS_1 }));
    } else if (!ruleName.test(linkCopy.value.trim())) {
      setLinkToClipBoard((pre) => ({ ...pre, error: MESSAGE.MS_7 }));
    }
  };

  const openPopover = Boolean(anchorEl);

  return (
    <Stack spacing={3} className={classes.dashboardContainer}>
      <Box>
        <Typography mb={3} variant="h3" fontWeight={800} fontSize={"2.5rem"} className={classes.title}>
          Connect people around <br /> the world together
        </Typography>

        <Typography mb={3} component="p" variant="body1" className={classes.subtitle}>
          Start video call with Talkin
        </Typography>
        <Box className={classes.buttonContainer}>
          <Button
            className={classes.button}
            variant="contained"
            onClick={handleClickNewMeetingBtn}
            startIcon={<VideoPlus />}
            aria-controls={openPopover ? "choose-meeting" : undefined}
            aria-haspopup="true"
            aria-expanded={openPopover ? "true" : undefined}
            aria-describedby="choose-meeting"
          >
            <Typography fontWeight={600}>New meeting</Typography>
          </Button>
          <Box className={classes.form}>
            <TextField
              value={linkCopy.value}
              placeholder="Enter meeting ID"
              onChange={handleOnChange}
              onBlur={handleBlur}
              required
              margin="normal"
              id="roomID"
              name="roomID"
              error={!!linkCopy.error}
              sx={{
                "& input:focus": {
                  boxShadow: "none",
                },
              }}
              className={classes.input}
              helperText={linkCopy.error}
            />

            <Button
              className={classes.button}
              variant="contained"
              onClick={handleJoinMeeting}
              disabled={!linkCopy.value}
            >
              Join
            </Button>
          </Box>
        </Box>
        <Menu
          id="choose-meeting"
          open={openPopover}
          anchorEl={anchorEl}
          onClose={closeAddMeetingPopup}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          sx={{
            left: "25px",
            top: "-10px",
          }}
          className={classes.boxMenuItems}
        >
          <MenuItem
            onClick={() => {
              closeAddMeetingPopup();
              hanldeCreateMeeting();
            }}
          >
            <PlusIcon />
            <Typography>&nbsp;Create an instant meeting</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              closeAddMeetingPopup();
              navigate(generatePath(Paths.SchedulePage, { meetingId: "" }));
            }}
          >
            <LinkHorizontalIcon />
            <Typography>&nbsp;Schedule a meeting</Typography>
          </MenuItem>
        </Menu>
      </Box>
      <Divider sx={{ marginTop: "20px" }} />
      <Typography variant="h6" fontWeight={400} fontSize={"18px"}>
        Reach more about Talkin.{" "}
      </Typography>

      <BaseDialog open={open} onClose={() => setOpen(false)} className={classes.dialog}>
        <div className={classes.contentDialog}>
          <div className={classes.header}>
            <NetWorkIcon className={classes.iconTitle} />
            <Typography variant="body1">
              Meeting information
            </Typography>
          </div>
          <CloseIcon className={classes.close} onClick={() => setOpen(false)} />

          <div className={classes.linkContent}>
            <NavLink to={`${location}/waiting-room/${roomId}`} className={classes.link} target="_blank">
              Meeting link
            </NavLink>
            <Typography>ID: {roomId}</Typography>
          </div>
          <div className={classes.action}>
            <CopyToClipboard text={contentCopy()} onCopy={handleOnCopy}>
              <Tooltip
                title={"Copied!"}
                open={linkCopy.copy}
                placement="top"
                disableFocusListener
                disableHoverListener
                disableTouchListener
              >
                <Button variant="contained" startIcon={<CopyIcon />} className={classes.copy}>
                  Copy
                </Button>
              </Tooltip>
            </CopyToClipboard>

            <Button variant="contained" className={classes.share} startIcon={<ShareIcon />} onClick={handleOpenShare}>
              <Typography fontWeight={600}>Share</Typography>
            </Button>
          </div>
        </div>
      </BaseDialog>

      <BaseDialog open={openShare} onClose={() => setOpenShare(false)}>
        <div className={classes.contentDialog}>
          <DialogTitle>Send meeting invitation to your guests</DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <TextField
              hiddenLabel
              variant="filled"
              size="small"
              placeholder="Enter email"
              className={classes.email}
              sx={{
                "& input:focus": {
                  boxShadow: "none",
                },
              }}
            />

            <Button className={classes.button} variant="contained" onClick={handleOpenShare}>
              Share
            </Button>
          </DialogContent>
        </div>
      </BaseDialog>
    </Stack>
  );
};

export default Dashboard;
