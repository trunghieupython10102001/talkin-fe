import RoomClient from "@/classes/RoomClient";
import { SESSION_STORAGE_KEY } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { IUserState as IUserInfo } from "@/interfaces/store";
import { TDeviceState } from "@/interfaces/waitingRoom";
import { userActions } from "@/store/userSlice";
import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface IMediaSource {
  videoTracks: MediaStreamTrack[] | undefined;
  audioTracks: MediaStreamTrack[] | undefined;
  activeVideoSource: MediaStreamTrack | undefined;
  activeAudioSource: MediaStreamTrack | undefined;
}

const mediaSourcesInitValues: IMediaSource = {
  videoTracks: undefined,
  audioTracks: undefined,
  activeVideoSource: undefined,
  activeAudioSource: undefined,
};

type TUpdateMediaSource = {
  type: "UPDATE_MEDIA_SOURCES";
  value: {
    videoTracks: MediaStreamTrack[];
    audioTracks: MediaStreamTrack[];
    activeVideoSource: string;
    activeAudioSource: string;
  };
};

type TStopVideoStream = {
  type: "UPDATE_MEDIA_VIDEO_SOURCE";
  value: { enabled: boolean; videoTracks?: MediaStreamTrack[] };
};

type TStopAudioStream = {
  type: "UPDATE_MEDIA_AUDIO_SOURCE";
  value: { enabled: boolean; audioTracks?: MediaStreamTrack[] };
};

type TReducerAction = TUpdateMediaSource | TStopVideoStream | TStopAudioStream;

const activeMediaSource = {
  video: "",
  audio: "",
};

function mediaReducer(state: IMediaSource, actions: TReducerAction): IMediaSource {
  switch (actions.type) {
    case "UPDATE_MEDIA_SOURCES": {
      const { videoTracks, activeAudioSource, activeVideoSource, audioTracks } = actions.value;
      const activeAudio = audioTracks.find((track) => track.id === activeAudioSource);
      const activeVideo = videoTracks.find((track) => track.id === activeVideoSource);

      activeMediaSource.audio = activeAudio!.label;
      activeMediaSource.video = activeVideo!.label;

      return {
        audioTracks,
        videoTracks,
        activeAudioSource: activeAudio,
        activeVideoSource: activeVideo,
      };
    }

    case "UPDATE_MEDIA_VIDEO_SOURCE": {
      const updatedState = { ...state };
      const { enabled, videoTracks } = actions.value;

      if (!enabled) {
        updatedState.activeVideoSource = undefined;
        for (const track of updatedState.videoTracks || []) {
          track.stop();
        }

        updatedState.videoTracks = [];
      } else {
        updatedState.videoTracks = videoTracks;
        updatedState.activeVideoSource =
          videoTracks!.find((track) => track.label === activeMediaSource.video) || videoTracks?.[0];
      }

      return updatedState;
    }

    case "UPDATE_MEDIA_AUDIO_SOURCE": {
      const updatedState = { ...state };
      const { enabled, audioTracks } = actions.value;
      if (!enabled) {
        updatedState.activeAudioSource = undefined;
        for (const track of updatedState.audioTracks || []) {
          track.stop();
        }

        updatedState.audioTracks = [];
      } else {
        updatedState.audioTracks = audioTracks;
        updatedState.activeAudioSource =
          audioTracks!.find((track) => track.label === activeMediaSource.audio) || audioTracks?.[0];
      }
      return updatedState;
    }

    default:
      return state;
  }
}

export default function useWaitingScreenViewController({
  user,
  roomClient,
}: {
  user: IUserInfo;
  roomClient?: RoomClient;
}) {
  const [mediaSouces, mediaActionsDispatch] = useReducer(mediaReducer, mediaSourcesInitValues);
  const { roomId } = useParams();
  // Re render component -> get Devices
  const [, setForkUpdate] = useState<number>(1);

  const roomState = useAppSelector((state) => state.room.state);

  const isDisconnectedToRoom = roomState === "disconnected";

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const microphoneList = Array.from(roomClient?.microphones?.values() || []).filter(
    (mic) => mic.deviceId !== "communications"
  );
  const webcamList = Array.from(roomClient?.webcams?.values() || []).filter((mic) => mic.deviceId !== "communications");
  const speakerList = Array.from(roomClient?.speakers?.values() || []).filter(
    (mic) => mic.deviceId !== "communications"
  );

  let micState: TDeviceState = "unsupported";
  let webcamState: TDeviceState = "unsupported";

  if (!user.canSendMic) micState = "unsupported";
  else if (!user.audioMuted) micState = "on";
  else micState = "off";

  if (!user.canSendWebcam) webcamState = "unsupported";
  else if (!user.webCamDisabled) webcamState = "on";
  else webcamState = "off";

  const micStateToggleHandler = async () => {
    let audioTracks = undefined;

    if (micState === "on") {
      dispatch(userActions.setAudioMutedState({ enabled: false }));
    } else {
      audioTracks = (
        await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: sessionStorage.getItem(SESSION_STORAGE_KEY.MIC_ID) || "default",
          },
        })
      ).getAudioTracks();

      dispatch(userActions.setAudioMutedState({ enabled: true }));
    }

    mediaActionsDispatch({
      type: "UPDATE_MEDIA_AUDIO_SOURCE",
      value: {
        enabled: !(micState === "on"),
        audioTracks,
      },
    });
  };

  const webcamStateToggleHandler = async () => {
    let videoTracks = undefined;

    if (webcamState === "on") {
      dispatch(userActions.setWebcamCapabilityState({ enabled: false }));
    } else {
      videoTracks = (
        await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: sessionStorage.getItem(SESSION_STORAGE_KEY.CAMERA_ID) || "default",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
      ).getVideoTracks();

      dispatch(userActions.setWebcamCapabilityState({ enabled: true }));
    }

    mediaActionsDispatch({
      type: "UPDATE_MEDIA_VIDEO_SOURCE",
      value: {
        enabled: !(webcamState === "on"),
        videoTracks,
      },
    });
  };

  const updateDisplayNameHandler = (name: string) => {
    // roomClient!.changeDisplayName(name);
  };

  const joinMeetingHanler = () => {
    roomClient?.join();
    navigate(`/video-call/${roomId}`);
  };

  const joinMeetingGuest = (guestName: string) => {
    roomClient?.join(guestName);
    navigate(`/video-call/${roomId}`);
  };

  const cancelJoinMeeting = () => {
    roomClient?.cancelWaitingRoom();
    navigate("/");
  };

  const tryReconnectToMeetingRoom = () => {
    roomClient?.prepareJoin(roomId || "");
  };

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const mediaStream = await roomClient?.prepareJoin(roomId || "", window.location.search.includes("error"));

        if (mediaStream) {
          const videoTracks = mediaStream.getVideoTracks();
          const audioTracks = mediaStream.getAudioTracks();
          const [videoStream] = videoTracks;
          const [audioStream] = audioTracks;

          mediaActionsDispatch({
            type: "UPDATE_MEDIA_SOURCES",
            value: {
              videoTracks,
              audioTracks,
              activeAudioSource: audioStream.id,
              activeVideoSource: videoStream.id,
            },
          });

          dispatch(
            userActions.setMediaCapabilities({
              canSendMic: true,
              canSendWebcam: true,
            })
          );
          dispatch(
            userActions.setAudioMutedState({
              enabled: true,
            })
          );
          dispatch(
            userActions.setWebcamCapabilityState({
              enabled: true,
            })
          );
        }
      } catch (error) {
        // Mic and cam permission is denied
        if ((error as Error).name === "NotAllowedError") {
          dispatch(
            userActions.setMediaCapabilities({
              canSendMic: false,
              canSendWebcam: false,
            })
          );
        }
      }
    };

    const updateMediaSource = () => {
      return roomClient?._updateMediaDeviceSource();
    };

    getMediaStream()
      .then(() => {
        return updateMediaSource();
      })
      .then(() => {
        setForkUpdate((i) => i + 1);
      });
  }, [dispatch, roomClient, roomId]);

  useEffect(() => {
    return () => {
      if (mediaSouces.audioTracks) {
        for (const track of mediaSouces.audioTracks) {
          track.stop();
        }
      }
    };
  }, [mediaSouces.audioTracks]);

  useEffect(() => {
    return () => {
      if (mediaSouces.videoTracks) {
        for (const track of mediaSouces.videoTracks) {
          track.stop();
        }
      }
    };
  }, [mediaSouces.videoTracks]);

  return {
    micState,
    webcamState,
    isDisconnectedToRoom,
    videoTracks: mediaSouces.activeVideoSource,
    audioTracks: mediaSouces.activeAudioSource,
    videoVisible: !!mediaSouces.activeVideoSource,
    microphoneList,
    webcamList,
    speakerList,
    micStateToggleHandler,
    webcamStateToggleHandler,
    updateDisplayNameHandler,
    joinMeetingHanler,
    cancelJoinMeeting,
    tryReconnectToMeetingRoom,
    joinMeetingGuest,
  };
}
