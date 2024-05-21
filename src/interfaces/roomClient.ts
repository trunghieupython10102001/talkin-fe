import { IDeviceInfo } from "./type";
import type { types } from "mediasoup-client";

export interface IRoomClientInitOptions {
  roomId: string;
  peerId: string;
  displayName: string;
  device: IDeviceInfo;
  handlerName: types.BuiltinHandlerName;
  forceTcp: boolean;
  produce: boolean;
  consume: boolean;
  datachannel: boolean;
  forceVP8: boolean;
  forceH264: boolean;
  forceVP9: boolean;
  enableWebcamLayers: boolean;
  enableSharingLayers: boolean;
  webcamScalabilityMode: string;
  sharingScalabilityMode: string;
  numSimulcastStreams: number;
  externalVideo: boolean;
  e2eKey: string;
  consumerReplicas: string;
}
