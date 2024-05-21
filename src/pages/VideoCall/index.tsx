import {
  Badge,
  Box,
  Card,
  CardContent,
  Container,
  Drawer,
  Grid,
  IconButton,
  Typography,
  Button,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useStyles } from "./styles";

import { useRoom } from "./use-room";
import { EDrawerType } from "@/interfaces/type";
import MeetingDetail from "@/components/Views/VideoCall/BoxDrawer/MeetingDetail";
import Users from "@/components/Views/VideoCall/BoxDrawer/Users";
import Chat from "@/components/Views/VideoCall/BoxDrawer/Chat";
import Activities from "@/components/Views/VideoCall/BoxDrawer/Activities";
import React from "react";
import classNames from "classnames";
import Timestamp from "@/components/common/Timestamp";
import {
  MicrophoneIcon,
  MicrophoneOffIcon,
  VideocamIcon,
  VideocamOffIcon,
  ShareScreenIcon,
  PhoneHangUpIcon,
  InfoIcon,
  UsersIcon,
  ChatIcon,
  CategoriesIcon,
  StopRecordingIcon,
  ShareScreenWhiteIcon,
} from "@/assets";
import { BaseDialog } from "@/components/common/base-dialog";
import { SETTINGS_MENU, SHARE_MENU } from "@/constants";
import Record from "@/components/Views/VideoCall/BoxDrawer/Record";
import { useAppSelector } from "@/hooks";
import Peers from "./Peers";

const VideoCall: React.FC = () => {
  const classes = useStyles();
  const {
    roomName,
    countParticipant,
    micState,
    webcamState,
    drawer,
    cntMessageUnRead,
    rfAnchorSetting,
    setRfAnchorSetting,
    handleOnOffMic,
    handleOnOffWebcam,
    outRoomHanler,
    setDrawer,
    closeDrawer,
    isLeaveRoom,
    setIsLeaveRoom,
    isRecording,
    handleStopRecording,
    setShareAnchorSetting,
    shareAnchorSetting,
    handleChooseOptionShare,
    appData,
    handleStopSharing,
    isSharingScreen,
  } = useRoom();

  const { isLogged } = useAppSelector((state) => state.auth);

  const renderDrawerContent = () => {
    switch (drawer.type) {
      case EDrawerType.INFORMATION_ROOM:
        return <MeetingDetail onClose={closeDrawer} />;
      case EDrawerType.USERS:
        return <Users onClose={closeDrawer} />;
      case EDrawerType.CHAT:
        return <Chat onClose={closeDrawer} />;
      case EDrawerType.ACTIVITIES:
        return <Activities onClose={closeDrawer} />;
      case EDrawerType.RECORDING:
        return <Record onClose={closeDrawer} />;
      default:
        return;
    }
  };

  return (
    <Container maxWidth={false} disableGutters className={classes.main}>
      <Box component="div" className={classes.wrapperMainScreen}>
        <Peers drawerOpen={drawer.isOpen} />
        {isSharingScreen ? (
          <div className={classes.headerShare}>
            <div className={classes.dFlex}>
              {" "}
              <ShareScreenWhiteIcon />
              <Typography variant="body1">
                {" "}
                {appData.displayName ? `${appData.displayName} (presenting)` : "You are presenting to everyone"}
              </Typography>
            </div>

            <Button variant="text" onClick={handleStopSharing}>
              Stop presenting
            </Button>
          </div>
        ) : (
          ""
        )}

        {drawer.isOpen && (
          <Drawer
            sx={{
              width: "calc(100% / 12 * 3)",
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: "calc(100% / 12 * 3)",
                height: "calc(100% - 5rem)",
                background: "transparent",
                border: "none",
              },
            }}
            variant="persistent"
            anchor="right"
            open={drawer.isOpen}
          >
            <Box component="div" margin={2} className={classes.boxDrawer}>
              <Card>
                <CardContent>{renderDrawerContent()}</CardContent>
              </Card>
            </Box>
          </Drawer>
        )}
      </Box>
      <Box component="div" className={classes.action}>
        <Grid container padding={2}>
          <Grid container item xs={4} md={3} className={classes.actionLeftRight} justifyContent="flex-start">
            <Box component="div" marginLeft={2}></Box>
            <div className={classes.meetingName}>
              <Typography variant="h6" component="h1">
                {roomName || "Meeting"}
              </Typography>
              <Timestamp />
            </div>
          </Grid>
          <Grid container item xs={12} md={6} justifyContent="center" className={classes.actionCenter}>
            <IconButton onClick={handleOnOffMic} className={classNames({ "media-off": micState === "off" })}>
              {micState === "on" ? <MicrophoneIcon /> : <MicrophoneOffIcon />}
            </IconButton>
            <IconButton onClick={handleOnOffWebcam} className={classNames({ "media-off": webcamState === "off" })}>
              {webcamState === "on" ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton onClick={(e) => setShareAnchorSetting(e.currentTarget)}>
              <ShareScreenIcon />
            </IconButton>
            <IconButton className="end-call" onClick={() => setIsLeaveRoom(true)}>
              <PhoneHangUpIcon />
            </IconButton>

            {isRecording && (
              <IconButton className={classes.stopRecording} onClick={handleStopRecording} disabled={!isLogged}>
                <StopRecordingIcon />
                <Typography>Stop recording</Typography>
              </IconButton>
            )}
          </Grid>
          <Grid container item xs={4} md={3} className={classes.actionLeftRight} justifyContent="flex-end">
            <IconButton
              className={classNames(classes.actionRight, {
                [classes.actionRightActive]: drawer.type === EDrawerType.INFORMATION_ROOM && drawer.isOpen,
              })}
              onClick={() => {
                setDrawer(EDrawerType.INFORMATION_ROOM);
              }}
            >
              <InfoIcon />
            </IconButton>
            <IconButton
              className={classNames(classes.actionRight, {
                [classes.actionRightActive]: drawer.type === EDrawerType.USERS && drawer.isOpen,
              })}
              onClick={() => {
                setDrawer(EDrawerType.USERS);
              }}
            >
              <Badge badgeContent={countParticipant}>
                <UsersIcon />
              </Badge>
            </IconButton>

            <IconButton
              className={classNames(classes.actionRight, {
                [classes.actionRightActive]:
                  (drawer.type === EDrawerType.CHAT && drawer.isOpen) || cntMessageUnRead > 0,
              })}
              onClick={() => {
                setDrawer(EDrawerType.CHAT);
              }}
            >
              {drawer.type === EDrawerType.CHAT && drawer.isOpen ? (
                <ChatIcon />
              ) : (
                <Badge badgeContent={cntMessageUnRead !== 0 ? cntMessageUnRead : ""}>
                  <ChatIcon />
                </Badge>
              )}
            </IconButton>

            <Box component="div" marginRight={2}></Box>
          </Grid>
        </Grid>
      </Box>

      <BaseDialog open={isLeaveRoom} onClose={() => setIsLeaveRoom(false)} className={classes.dialogLeave}>
        <div className={classes.leaveRoom}>
          <Typography className={classes.title}> Leave the meeting</Typography>
          <Typography variant="body1" className={classes.content}>
            Are you sure you want to leave the meeting?
          </Typography>
        </div>
        <div className={classes.btnAction}>
          <Button variant="contained" className={classes.cancel} onClick={() => setIsLeaveRoom(false)}>
            No
          </Button>
          <Button variant="contained" onClick={outRoomHanler}>
            Yes
          </Button>
        </div>
      </BaseDialog>

      {/* <Popover
        open={Boolean(rfAnchorSetting)}
        anchorEl={rfAnchorSetting}
        onClose={() => setRfAnchorSetting(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <List className={classes.boxSettings}>
          {SETTINGS_MENU.map((item, index) => (
            <ListItem key={index}>
              <ListItemButton onClick={() => handleChooseOptionSettings(item.type)}>
                <ListItemIcon>{<item.icon />}</ListItemIcon>
                <ListItemText primary={item.type} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover> */}

      <Popover
        open={Boolean(shareAnchorSetting)}
        anchorEl={shareAnchorSetting}
        onClose={() => setShareAnchorSetting(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <List className={classes.boxSettings}>
          {SHARE_MENU.map((item, index) => (
            <ListItem key={index}>
              <ListItemButton onClick={() => handleChooseOptionShare(item.type)}>
                <ListItemIcon>{<item.icon />}</ListItemIcon>
                <ListItemText primary={item.type} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </Container>
  );
};

export default VideoCall;
