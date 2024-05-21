import { store } from "store";
import { types } from "mediasoup-client";
import { ENOTIFY_TYPE } from "@/constants";
import { AppData } from "mediasoup-client/lib/types";

export type TAppState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;

export interface INotification {
  id: string;
  type: ENOTIFY_TYPE;
  title: string;
  text: string;
  timeout: number;
  userName: string;
}

export interface IConsumer {
  locallyPaused: boolean;
  remotelyPaused: boolean;
  currentSpatialLayer?: number;
  currentTemporalLayer?: number;
  preferredSpatialLayer: number;
  preferredTemporalLayer: number;
  priority: number;
  track: types.Consumer["track"];
  score?: number;
  id: string;
  type: string;
  rtpParameters: any;
  spatialLayers: number;
  temporalLayers: number;
  codec: any;
  appData?: {
    share: boolean;
  };
}

interface IComsumer {
  id: string;
  sctpStreamParameters: types.SctpStreamParameters;
  label: string;
  protocol: string;
}

export interface IDataConsumer extends IComsumer {}

export interface IProducer {
  id: string;
  paused: boolean;
  track: MediaStreamTrack | null;
  rtpParameters: types.RtpParameters;
  codec: string;
  type?:
    | // For webcam
    "back"
    | "front"
    // for share screen
    | "share";
  deviceLabel?: string;
  score?: number;
}

export interface IDataProducer extends IComsumer {}

export interface IPresenter {
  peerId: string;
  producerId: string;
}

export interface IUserState {
  id: string | null;
  displayName: string | null;
  displayNameSet: boolean;
  device: any | null;
  canSendMic: boolean;
  canSendWebcam: boolean;
  canChangeWebcam: boolean;
  canChangeMic: boolean;
  canChangeSpeaker: boolean;
  webcamInProgress: boolean;
  shareInProgress: boolean;
  audioOnly: boolean;
  audioOnlyInProgress: boolean;
  audioMuted: boolean;
  webCamDisabled: boolean;
  restartIceInProgress: boolean;
  isHost: boolean;
  isRecording: boolean;
  appData: AppData;
  presenter: IPresenter;
}
