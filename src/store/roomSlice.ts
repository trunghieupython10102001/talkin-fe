import { EDrawerType, IDrawer, IMessage, ILivestreamRoomInfo, EStatusLivestream } from "@/interfaces/type";
import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IRoomState {
  url: null | string;
  state: "new" | "connecting" | "connected" | "disconnected" | "closed";
  activeSpeakerId: null | string;
  statsPeerId: null | string;
  faceDetection: boolean;
  messages: IMessage[];
  drawer: IDrawer;
  cntMessageUnRead: number;
  roomInfo: ILivestreamRoomInfo;
  peerPinId: string;
}

const initialState: IRoomState = {
  url: null,
  state: "new",
  activeSpeakerId: null,
  statsPeerId: null,
  faceDetection: false,
  messages: [],
  drawer: {
    isOpen: false,
    type: EDrawerType.INFORMATION_ROOM,
  },
  cntMessageUnRead: 0,
  roomInfo: {
    peers: 0,
    status: EStatusLivestream.COMMING_SOON,
  },
  peerPinId: "",
};

const _setRoomURL: CaseReducer<IRoomState, PayloadAction<{ url: string }>> = (state, action) => {
  const { url } = action.payload;
  state.url = url;
};

const _setRoomState: CaseReducer<IRoomState, PayloadAction<{ state: IRoomState["state"] }>> = (state, action) => {
  state.state = action.payload.state;
  if (action.payload.state !== "connected") {
    state.activeSpeakerId = null;
    state.statsPeerId = null;
  }
};

const _setRoomLSInfo: CaseReducer<IRoomState, PayloadAction<{ status: EStatusLivestream; peers: number }>> = (
  state,
  action
) => {
  state.roomInfo.status = action.payload.status;
  state.roomInfo.peers = action.payload.peers;
};

const _setNumberOfViewers: CaseReducer<IRoomState, PayloadAction<{ numberOfViewers: number }>> = (state, action) => {
  state.roomInfo.peers = action.payload.numberOfViewers;
};

const _setRoomActiveSpeaker: CaseReducer<IRoomState, PayloadAction<{ peerId: string }>> = (state, action) => {
  state.activeSpeakerId = action.payload.peerId;
};

const _setRoomStatsPeerId: CaseReducer<IRoomState, PayloadAction<{ peerId: string }>> = (state, action) => {
  state.statsPeerId = state.statsPeerId === action.payload.peerId ? null : action.payload.peerId;
};

const _setRoomFaceDetection: CaseReducer<IRoomState, PayloadAction<{ flag: boolean }>> = (state, action) => {
  state.faceDetection = action.payload.flag;
};

const _removePeer: CaseReducer<IRoomState, PayloadAction<{ peerId: string }>> = (state, action) => {
  const { peerId } = action.payload;

  if (peerId && peerId === state.activeSpeakerId) {
    state.activeSpeakerId = null;
  }

  if (peerId && peerId === state.statsPeerId) {
    state.statsPeerId = null;
  }
};

const _addMessage: CaseReducer<IRoomState, PayloadAction<IMessage>> = (state, action) => {
  state.messages.push(action.payload);
};

const _clearMessages: CaseReducer<IRoomState, PayloadAction> = (state, action) => {
  state.messages = [];
};

const _setDrawer: CaseReducer<IRoomState, PayloadAction<IDrawer>> = (state, action) => {
  state.drawer = action.payload;
};

const _setCntMessageUnRead: CaseReducer<IRoomState, PayloadAction<{ count: number }>> = (state, action) => {
  state.cntMessageUnRead = action.payload.count;
};

const _setPeerPinId: CaseReducer<IRoomState, PayloadAction<{ peerId: string }>> = (state, action) => {
  state.peerPinId = action.payload.peerId;
};

export const roomSlice = createSlice({
  name: "room",
  reducers: {
    setRoomURL: _setRoomURL,
    setRoomState: _setRoomState,
    setRoomActiveSpeaker: _setRoomActiveSpeaker,
    setRoomStatsPeerId: _setRoomStatsPeerId,
    setRoomFaceDetection: _setRoomFaceDetection,
    removePeer: _removePeer,
    addMessage: _addMessage,
    clearMessage: _clearMessages,
    setDrawer: _setDrawer,
    setCntMessageUnRead: _setCntMessageUnRead,
    setRoomLSInfo: _setRoomLSInfo,
    setNumberOfViewers: _setNumberOfViewers,
    setPeerPinId: _setPeerPinId,
  },
  initialState,
});

export const roomActions = roomSlice.actions;
export const roomAsyncActions = {};

export default roomSlice.reducer;
