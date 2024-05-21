import { useContext, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { TDeviceState } from "@/interfaces/waitingRoom";
import RoomContext from "@/context/RoomContext";
import { IProducer } from "@/interfaces/store";
import * as cookiesManager from "@/utils/cookiesManager";
import { roomActions } from "@/store/roomSlice";

export const useMeInRoom = () => {
  const me = useAppSelector((state) => state.user);
  const avatarUrl = useAppSelector((state) => state.auth.profile.avatar);
  const { state, faceDetection } = useAppSelector((state) => state.room);
  const roomClient = useContext(RoomContext);
  const producers = useAppSelector((state) => state.producer);
  const dispatch = useAppDispatch();

  const producersArray: IProducer[] = Object.values(producers);

  const audioProducer = producersArray.find((producer) => producer.track?.kind === "audio");
  const videoProducer = producersArray.find(
    (producer) => producer.track?.kind === "video" && producer.type !== "share"
  );

  let micState: TDeviceState = "unsupported";
  if (!me.canSendMic) {
    micState = "unsupported";
  } else if (!audioProducer) {
    micState = "unsupported";
  } else if (!audioProducer.paused) {
    micState = "on";
  } else {
    micState = "off";
  }

  let webcamState: TDeviceState = "unsupported";
  if (!me.canSendWebcam) {
    webcamState = "unsupported";
  } else if (videoProducer && videoProducer.type !== "share") {
    webcamState = "on";
  } else {
    webcamState = "off";
  }

  let changeWebcamState: TDeviceState = "unsupported";
  if (Boolean(videoProducer) && videoProducer?.type !== "share" && me.canChangeWebcam) {
    changeWebcamState = "on";
  } else {
    changeWebcamState = "unsupported";
  }

  let shareState: TDeviceState = "unsupported";
  if (Boolean(videoProducer) && videoProducer?.type === "share") {
    shareState = "on";
  } else {
    shareState = "off";
  }

  const videoVisible = Boolean(videoProducer) && !videoProducer?.paused;

  let tip;

  if (!me.displayNameSet) {
    tip = "Click on your name to change it";
  }

  const handleOnOffWebcam = useCallback(() => {
    if (webcamState === "on") {
      cookiesManager.setDevices({ webcamEnabled: false });
      roomClient?.disableWebcam();
    } else {
      cookiesManager.setDevices({ webcamEnabled: true });
      roomClient?.enableWebcam();
    }
  }, [webcamState, roomClient]);

  const handleOnOffMic = useCallback(() => {
    return micState === "on" ? roomClient?.muteMic() : roomClient?.unmuteMic();
  }, [micState, roomClient]);

  const handleSetStatsPeerId = (peerId: string) => {
    dispatch(roomActions.setRoomStatsPeerId({ peerId }));
  };

  const handleChangeDisplayName = useCallback(
    (name: string) => {
      roomClient?.changeDisplayName(name);
    },
    [roomClient]
  );

  const handleChangeMaxSendingSpatialLayer = useCallback(
    (spatialLayer: number) => {
      roomClient?.setMaxSendingSpatialLayer(spatialLayer);
    },
    [roomClient]
  );

  return {
    me,
    connected: state === "connected",
    micState,
    webcamState,
    changeWebcamState,
    shareState,
    videoVisible,
    tip,
    roomClient,
    audioProducer,
    videoProducer,
    faceDetection,
    avatarUrl: `${process.env.REACT_APP_BE_BASE_URL}/${avatarUrl}`,
    handleOnOffWebcam,
    handleOnOffMic,
    handleSetStatsPeerId,
    handleChangeDisplayName,
    handleChangeMaxSendingSpatialLayer,
  };
};
