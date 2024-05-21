import { useState } from "react";
import { IUserState as IUserInfo } from "@/interfaces/store";
import useWaitingScreenViewController from "./useWaitingScreenViewController";
import { Typography, Button, IconButton, TextField } from "@mui/material";
import RoomClient from "@/classes/RoomClient";
import UserView from "@/components/Views/WaitingRoom/UserView/";
import { useStyles } from "./styles";
import { useAppSelector } from "@/hooks";
import { MESSAGE } from "@/constants/message";
import { REGEX } from "@/constants/regex";
import { ReactComponent as Microphone } from "@/assets/svg/microphone.svg";
import { ReactComponent as MicrophoneOff } from "@/assets/svg/microphone-slash.svg";
import { ReactComponent as VideocamIcon } from "@/assets/svg/video.svg";
import { ReactComponent as VideocamOffIcon } from "@/assets/svg/video-slash.svg";
import classNames from "classnames";

interface IComponentProps {
  user: IUserInfo;
  roomClient?: RoomClient;
}

const WaitingScreen: React.FC<IComponentProps> = ({ roomClient, user }) => {
  const {
    micState,
    webcamState,
    videoVisible,
    videoTracks,
    audioTracks,
    microphoneList,
    speakerList,
    webcamList,
    isDisconnectedToRoom,
    micStateToggleHandler,
    webcamStateToggleHandler,
    updateDisplayNameHandler,
    joinMeetingHanler,
    cancelJoinMeeting,
    tryReconnectToMeetingRoom,
    joinMeetingGuest,
  } = useWaitingScreenViewController({ user, roomClient });

  const classes = useStyles();
  const isLogged = useAppSelector((state) => state.auth.isLogged);

  const [displayName, setDisPlayName] = useState("");
  const [error, setError] = useState("");
  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setDisPlayName(e.target.value);
    setError("");
  };

  const handleOnBlur = () => {
    const ruleName = REGEX.ONLY_NUMBER_CHARACTERS_SPACE;
    if (displayName.trim() === "") {
      setError(MESSAGE.MS_1);
    } else if (!ruleName.test(displayName.trim())) {
      setError(MESSAGE.MS_7);
    } else if (displayName.trim().length > 100) {
      setError(MESSAGE.MS_23);
    }
  };

  const handleJoinMeeting = () => {
    if (isLogged) {
      joinMeetingHanler();
    } else {
      joinMeetingGuest(displayName);
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.videoContainer}>
        <UserView
          displayName={user.displayName || ""}
          audioTrack={audioTracks}
          videoTrack={videoTracks}
          microphones={microphoneList || []}
          webcams={webcamList || []}
          speakers={speakerList || []}
          videoVisible={videoVisible}
          audioMuted={micState !== "on"}
          onChangeDisplayName={updateDisplayNameHandler}
        />

        <div className={classes.actionsContainer}>
          <IconButton
            className={classNames({ "media-off": micState === "off" })}
            disabled={micState === "unsupported"}
            onClick={micStateToggleHandler}
          >
            {micState === "off" ? <MicrophoneOff /> : <Microphone />}
          </IconButton>

          <IconButton
            className={classNames({ "media-off": webcamState === "off" })}
            disabled={webcamState === "unsupported"}
            onClick={webcamStateToggleHandler}
          >
            {webcamState === "off" ? <VideocamOffIcon /> : <VideocamIcon />}
          </IconButton>
        </div>
      </div>

      <div className={classes.right}>
        <Typography component="h1" variant="h4" align="center" fontWeight={800}>
          Waiting Room
        </Typography>
        <Typography component="h6"> Ready to join?</Typography>
        {!isLogged && (
          <div className={classes.guestInput}>
            <TextField
              margin="normal"
              placeholder="Enter your name"
              name="display"
              value={displayName}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              autoFocus
              autoComplete="off"
              helperText={error}
              error={!!error}
              sx={{ width: "100%" }}
            />
          </div>
        )}
        <div className={classes.action}>
          <Button variant="contained" onClick={cancelJoinMeeting} className={classes.cancel}>
            Cancel
          </Button>

          {isDisconnectedToRoom ? (
            <Button variant="contained" onClick={tryReconnectToMeetingRoom}>
              Try Reconnect
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleJoinMeeting}
              disabled={(!isLogged && Boolean(!displayName)) || Boolean(error)}
            >
              Join Meeting
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingScreen;
