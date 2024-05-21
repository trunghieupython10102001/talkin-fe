import { IPresenter } from "./../interfaces/store";
import { IUserState } from "@/interfaces/store";
import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { roomActions } from "./roomSlice";
import { AppData } from "mediasoup-client/lib/types";

const initialState: IUserState = {
  id: "",
  displayName: "You",
  displayNameSet: false,
  device: null,
  canSendMic: false,
  canSendWebcam: false,
  canChangeWebcam: false,
  canChangeMic: false,
  canChangeSpeaker: false,
  webcamInProgress: false,
  shareInProgress: false,
  audioOnly: false,
  audioOnlyInProgress: false,
  audioMuted: false,
  webCamDisabled: false,
  restartIceInProgress: false,
  isHost: false,
  isRecording: false,
  appData: {
    displayName: "",
    kind: "",
    peerId: "",
    share: false,
  },
  presenter: {
    peerId: "",
    producerId: "",
  },
};

const _setRoomState: CaseReducer<IUserState, PayloadAction<{ state: string }>> = (state, action) => {
  if (action.payload.state === "closed") {
    Object.assign(state, {
      webcamInProgress: false,
      shareInProgress: false,
      audioOnly: false,
      audioOnlyInProgress: false,
      audioMuted: false,
      restartIceInProgress: false,
    });
  }
};

const _setUser: CaseReducer<
  IUserState,
  PayloadAction<{
    peerId: string;
    displayName: string;
    displayNameSet: boolean;
    device: any;
  }>
> = (state, action) => {
  const { peerId, displayName, displayNameSet, device } = action.payload;
  state.id = peerId;
  state.displayName = displayName;
  state.displayNameSet = displayNameSet;
  state.device = device;
};

const _setUserId: CaseReducer<IUserState, PayloadAction<{ peerId: string }>> = (state, action) => {
  const { peerId } = action.payload;
  state.id = peerId;
};

const _setMediaCapabilities: CaseReducer<
  IUserState,
  PayloadAction<{
    canSendMic?: boolean;
    canSendWebcam?: boolean;
  }>
> = (state, action) => {
  const { canSendMic, canSendWebcam } = action.payload;

  if ("canSendMic" in action.payload) {
    state.canSendMic = canSendMic as boolean;
  }
  if ("canSendWebcam" in action.payload) {
    state.canSendWebcam = canSendWebcam as boolean;
  }
};

const _setCanChangeWebcam: CaseReducer<
  IUserState,
  PayloadAction<{
    canChangeWebcam: boolean;
  }>
> = (state, action) => {
  const { canChangeWebcam } = action.payload;
  state.canChangeWebcam = canChangeWebcam;
};

const _setMediaDeviceChangable: CaseReducer<
  IUserState,
  PayloadAction<{
    canChangeWebcam: boolean;
    canChangeMic: boolean;
    canChangeSpeaker: boolean;
  }>
> = (state, action) => {
  const { canChangeWebcam, canChangeMic, canChangeSpeaker } = action.payload;
  state.canChangeWebcam = canChangeWebcam;
  state.canChangeMic = canChangeMic;
  state.canChangeSpeaker = canChangeSpeaker;
};

const _setWebcamInProgress: CaseReducer<
  IUserState,
  PayloadAction<{
    flag: boolean;
  }>
> = (state, action) => {
  const { flag } = action.payload;
  state.webcamInProgress = flag;
};

const _setShareInProgress: CaseReducer<
  IUserState,
  PayloadAction<{
    flag: boolean;
  }>
> = (state, action) => {
  const { flag } = action.payload;
  state.shareInProgress = flag;
};

const _setDisplayName: CaseReducer<
  IUserState,
  PayloadAction<{
    displayName: string;
  }>
> = (state, action) => {
  state.displayName = action.payload.displayName || state.displayName;
  state.displayNameSet = true;
};

const _setAudioOnlyState: CaseReducer<
  IUserState,
  PayloadAction<{
    enabled: boolean;
  }>
> = (state, action) => {
  const { enabled } = action.payload;
  state.audioOnly = enabled;
};

const _setAudioOnlyInProgress: CaseReducer<
  IUserState,
  PayloadAction<{
    flag: boolean;
  }>
> = (state, action) => {
  const { flag } = action.payload;
  state.audioOnlyInProgress = flag;
};

const _setAudioMutedState: CaseReducer<
  IUserState,
  PayloadAction<{
    enabled: boolean;
  }>
> = (state, action) => {
  const { enabled } = action.payload;
  state.audioMuted = !enabled;
};

const _setWebcamCapabilityState: CaseReducer<
  IUserState,
  PayloadAction<{
    enabled: boolean;
  }>
> = (state, action) => {
  const { enabled } = action.payload;
  state.webCamDisabled = !enabled;
};

const _setRestartIceInProgress: CaseReducer<
  IUserState,
  PayloadAction<{
    flag: boolean;
  }>
> = (state, action) => {
  const { flag } = action.payload;
  state.restartIceInProgress = flag;
};

const _setIsHostMeeting: CaseReducer<
  IUserState,
  PayloadAction<{
    isHost: boolean;
  }>
> = (state, action) => {
  const { isHost } = action.payload;
  state.isHost = isHost;
};

const _setIsRecording: CaseReducer<
  IUserState,
  PayloadAction<{
    isRecording: boolean;
  }>
> = (state, action) => {
  const { isRecording } = action.payload;
  state.isRecording = isRecording;
};

const _setAppData: CaseReducer<IUserState, PayloadAction<AppData>> = (state, action) => {
  state.appData = action.payload;
};

const _setPresenter: CaseReducer<IUserState, PayloadAction<IPresenter>> = (state, action) => {
  state.presenter = action.payload;
};

export const userSlice = createSlice({
  name: "user",
  reducers: {
    setRoomState: _setRoomState,
    setUser: _setUser,
    setMediaCapabilities: _setMediaCapabilities,
    setCanChangeWebcam: _setCanChangeWebcam,
    setWebcamInProgress: _setWebcamInProgress,
    setDisplayName: _setDisplayName,
    setAudioOnlyState: _setAudioOnlyState,
    setAudioOnlyInProgress: _setAudioOnlyInProgress,
    setAudioMutedState: _setAudioMutedState,
    setRestartIceInProgress: _setRestartIceInProgress,
    setShareInProgress: _setShareInProgress,
    setWebcamCapabilityState: _setWebcamCapabilityState,
    setMediaDeviceChangable: _setMediaDeviceChangable,
    setIsHostMeeting: _setIsHostMeeting,
    setUserId: _setUserId,
    setIsRecording: _setIsRecording,
    setAppData: _setAppData,
    setPresenter: _setPresenter,
  },
  initialState,
  extraReducers(builder) {
    builder.addCase(roomActions.setRoomState, (state, action) => {
      return _setRoomState(state, action);
    });
  },
});

export const userActions = userSlice.actions;
export const userAsyncActions = {};

export default userSlice.reducer;
