import { useState, useEffect, useContext, useCallback } from "react";
import RoomContext from "@/context/RoomContext";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { IProducer } from "@/interfaces/store";
import { EDrawerType, EScreenShareOptions, ESettingMenu, EShareMenu, IDrawer } from "@/interfaces/type";
import { TDeviceState } from "@/interfaces/waitingRoom";
import { useNavigate, useParams } from "react-router";
import { roomActions } from "@/store/roomSlice";
import { Paths } from "@/constants/path";
import { ENOTIFY_TYPE } from "@/constants";
import { notify } from "@/store/thunks/notify";

export const useRoom = () => {
  const { roomId } = useParams();
  const roomClient = useContext(RoomContext);
  const { state, peerPinId } = useAppSelector((state) => state.room);
  const producers = useAppSelector((state) => state.producer);
  const consumers = useAppSelector((state) => state.consumer);
  const peersObj = useAppSelector((state) => state.peers);
  const peers = Object.values(peersObj);
  const shareProducer =
    Object.values(producers).find((producer) => producer.type === "share") ||
    Object.values(consumers).find((consumer) => consumer.appData?.share);
  const isSharingScreen = !!shareProducer;
  const navigate = useNavigate();
  const me = useAppSelector((state) => state.user);
  const appData = me.appData;
  const dispatch = useAppDispatch();
  const drawer = useAppSelector((state) => state.room.drawer);
  const cntMessageUnRead = useAppSelector((state) => state.room.cntMessageUnRead);
  const [isLeaveRoom, setIsLeaveRoom] = useState<boolean>(false);
  const roomName = useAppSelector((state) => state.invite.roomName);
  const [rfAnchorSetting, setRfAnchorSetting] = useState<HTMLButtonElement | null>(null);
  const [shareAnchorSetting, setShareAnchorSetting] = useState<HTMLButtonElement | null>(null);

  const countParticipant = peers.length + 1;

  const outRoomHanler = async () => {
    await roomClient?.close();
    navigate("/");
  };

  // Khi rời khỏi phòng bằng cách nhấn back trên trình duyệt
  useEffect(() => {
    return () => {
      roomClient?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const producersArray: IProducer[] = Object.values(producers);

  const audioProducer = producersArray.find((producer) => producer.track?.kind === "audio");
  const videoProducer = producersArray.find((producer) => producer.track?.kind === "video");

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

  const handleOnOffWebcam = useCallback(() => {
    if (webcamState === "on") {
      roomClient?.disableWebcam();
    } else {
      roomClient?.enableWebcam();
    }
  }, [webcamState, roomClient]);

  const handleOnOffMic = useCallback(() => {
    return micState === "on" ? roomClient?.muteMic() : roomClient?.unmuteMic();
  }, [micState, roomClient]);

  const setDrawer = (type: EDrawerType) => {
    const payload: IDrawer = {
      type: type,
      isOpen: false,
    };
    if (drawer.type === type) {
      payload.isOpen = !drawer.isOpen;
    } else {
      payload.isOpen = true;
    }
    dispatch(roomActions.setDrawer(payload));
  };

  const closeDrawer = () => {
    const payload: IDrawer = {
      ...drawer,
      isOpen: false,
    };
    dispatch(roomActions.setDrawer(payload));
  };

  const handleChooseOptionSettings = (type: ESettingMenu) => {
    switch (type) {
      case ESettingMenu.MANAGE_RECORD:
        dispatch(roomActions.setDrawer({ isOpen: true, type: EDrawerType.RECORDING }));
        setRfAnchorSetting(null);
        break;
      case ESettingMenu.APPLY_VISUAL_EFFECTS:
      case ESettingMenu.CHANGE_LAYOUT:
      case ESettingMenu.SETTINGS:
      default:
        showMessageCommingsoon();
        break;
    }
  };

  const handleChooseOptionShare = (type: EShareMenu) => {
    switch (type) {
      case EShareMenu.ENTIRE_SCREEN:
        roomClient?.enableShare(EScreenShareOptions.WINDOW_TAB);
        setShareAnchorSetting(null);
        break;
      case EShareMenu.TAB:
        roomClient?.enableShare(EScreenShareOptions.BROWSER_TAB);
        setShareAnchorSetting(null);
        break;
      case EShareMenu.WINDOW:
        roomClient?.enableShare(EScreenShareOptions.SCREEN);
        setShareAnchorSetting(null);
        break;
      default:
        break;
    }
  };

  const handleStopSharing = () => {
    roomClient?.disableShare();
  };

  const showMessageCommingsoon = () => {
    dispatch(
      notify({
        type: ENOTIFY_TYPE.INFO,
        text: "Coming soon",
      })
    );
  };

  const handleStopRecording = () => {
    roomClient?.handleStopRecording(me.id || "");
  };

  const handlePin = (peerId: string) => {
    if (peerId === peerPinId) {
      dispatch(roomActions.setPeerPinId({ peerId: "" }));
    } else {
      dispatch(roomActions.setPeerPinId({ peerId: peerId }));
    }
  };

  useEffect(() => {
    if (drawer.isOpen && drawer.type === EDrawerType.CHAT) {
      dispatch(roomActions.setCntMessageUnRead({ count: 0 }));
    }
  }, [dispatch, drawer.isOpen, drawer.type]);

  useEffect(() => {
    if (state === "connecting" || state === "connected") return;
    navigate(`/waiting-room/${roomId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state === "disconnected") {
      navigate(Paths.RemovedPeer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    return () => {
      dispatch(roomActions.clearMessage());
    };
  }, [dispatch]);

  return {
    me,
    countParticipant,
    micState,
    webcamState,
    peers: peers.reverse().filter((peer) => peer.id !== peerPinId),
    isSharingScreen,
    shareProducer,
    drawer,
    cntMessageUnRead,
    roomName,
    rfAnchorSetting,
    peerPinId,
    outRoomHanler,
    handleOnOffWebcam,
    handleOnOffMic,
    setDrawer,
    closeDrawer,
    setIsLeaveRoom,
    handlePin,
    isLeaveRoom,
    setRfAnchorSetting,
    handleChooseOptionSettings,
    showMessageCommingsoon,
    isRecording: me.isRecording,
    handleStopRecording,
    setShareAnchorSetting,
    shareAnchorSetting,
    handleChooseOptionShare,
    appData,
    handleStopSharing,
  };
};
