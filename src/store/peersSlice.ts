import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IConsumer, IDataConsumer } from "@/interfaces/store";
import { roomActions } from "./roomSlice";
import { consumerActions } from "./consumerSlice";
import { dataConsumerActions } from "./dataConsumerSlice";

interface IPeersState {
  [key: string]: {
    id: string;
    consumers: IConsumer["id"][];
    dataConsumers: IDataConsumer["id"][];
    displayName: string;
    isGuest?: boolean;
    isHost: boolean;
    avatarUrl?: string;
  };
}

const initialState: IPeersState = {};

const _setRoomState: CaseReducer<IPeersState, PayloadAction<{ state: string }>> = (_state, action) => {
  if (action.payload.state === "closed") {
    return {};
  }
};

const _addPeers: CaseReducer<IPeersState, PayloadAction<{ peer: any }>> = (state, action) => {
  const { peer } = action.payload;

  state[peer.id] = peer;
  // const updateState = { ...state };
  // console.log("Updateed: ", updateState);

  return state;
};

const _removePeer: CaseReducer<IPeersState, PayloadAction<{ peerId: string }>> = (state, action) => {
  const { peerId } = action.payload;

  delete state[peerId];

  return state;
};

const _addConsumer: CaseReducer<IPeersState, PayloadAction<{ peerId: string; consumer: IConsumer }>> = (
  state,
  action
) => {
  const { peerId, consumer } = action.payload;

  const peer = state[peerId];

  if (peer) {
    peer.consumers.push(consumer.id);
  }
  return state;
};

const _setPeerDisplayName: CaseReducer<IPeersState, PayloadAction<{ peerId: string; displayName: string }>> = (
  state,
  action
) => {
  const { peerId, displayName } = action.payload;

  const peer = state[peerId];

  if (peer) {
    peer.displayName = displayName;
  }
};

const _removeConsumer: CaseReducer<IPeersState, PayloadAction<{ peerId: string; consumerId: string }>> = (
  state,
  action
) => {
  const { peerId, consumerId } = action.payload;
  const peer = state[peerId];

  if (!peer) return state;

  const idx = peer.consumers.indexOf(consumerId);
  peer.consumers.splice(idx, 1);
};

const _addDataConsumer: CaseReducer<IPeersState, PayloadAction<{ dataConsumer: IDataConsumer; peerId: string }>> = (
  state,
  action
) => {
  const { dataConsumer, peerId } = action.payload;

  // special case for bot DataConsumer.
  if (!peerId) return state;

  const peer = state[peerId];

  if (peer) {
    peer.dataConsumers.push(dataConsumer.id);
  }
};

const _removeDataConsumer: CaseReducer<IPeersState, PayloadAction<{ dataConsumerId: string; peerId: string }>> = (
  state,
  action
) => {
  const { dataConsumerId, peerId } = action.payload;

  // special case for bot DataConsumer.
  if (!peerId) return state;

  const peer = state[peerId];

  // NOTE: This means that the Peer was closed before, so it's ok.
  if (!peer) return state;

  const idx = peer.dataConsumers.indexOf(dataConsumerId);

  if (idx >= 0) {
    peer.dataConsumers.splice(idx, 1);
  }

  return state;
};

export const peersSlice = createSlice({
  name: "peers",
  reducers: {
    setRoomState: _setRoomState,
    addPeers: _addPeers,
    removePeer: _removePeer,
    addConsumer: _addConsumer,
    removeConsumer: _removeConsumer,
    addDataConsumer: _addDataConsumer,
    removeDataConsumer: _removeDataConsumer,
    setPeerDisplayName: _setPeerDisplayName,
  },
  initialState,
  extraReducers(builder) {
    builder.addCase(roomActions.setRoomState, (state, action) => {
      return _setRoomState(state, action);
    });

    builder.addCase(roomActions.removePeer, (state, action) => {
      return _removePeer(state, action);
    });

    builder.addCase(consumerActions.addConsumer, (state, action) => {
      return _addConsumer(state, action);
    });

    builder.addCase(consumerActions.removeConsumer, (state, action) => {
      _removeConsumer(state, action);
    });

    builder.addCase(dataConsumerActions.addDataConsumer, (state, action) => {
      _addDataConsumer(state, action);
    });

    builder.addCase(dataConsumerActions.removeDataConsumer, (state, action) => {
      _removeDataConsumer(state, action);
    });
  },
});

export const peersActions = peersSlice.actions;
export const peersAsyncActions = {};

export default peersSlice.reducer;
