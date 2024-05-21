import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IConsumer } from "@/interfaces/store";
import type { types } from "mediasoup-client";
import { roomActions } from "./roomSlice";

interface IConsumerState {
  [key: string]: IConsumer;
}

const initialState: IConsumerState = {};

const _setRoomState: CaseReducer<IConsumerState, PayloadAction<{ state: string }>> = (_state, action) => {
  if (action.payload.state === "closed") {
    return {};
  }
};

const _addConsumer: CaseReducer<IConsumerState, PayloadAction<{ consumer: IConsumer; peerId: string }>> = (
  state,
  action
) => {
  const { consumer } = action.payload;

  state[consumer.id] = consumer;
};

const _removeConsumer: CaseReducer<IConsumerState, PayloadAction<{ consumerId: string; peerId: string }>> = (
  state,
  action
) => {
  const { consumerId } = action.payload;

  delete state[consumerId];

  return state;
};

const _setConsumerPause: CaseReducer<IConsumerState, PayloadAction<{ consumerId: string; originator: string }>> = (
  state,
  action
) => {
  const { consumerId, originator } = action.payload;

  const consumer = state[consumerId];

  if (originator === "local") {
    consumer.locallyPaused = true;
  } else {
    consumer.remotelyPaused = true;
  }
};

const _setConsumerResume: CaseReducer<IConsumerState, PayloadAction<{ consumerId: string; originator: string }>> = (
  state,
  action
) => {
  const { consumerId, originator } = action.payload;

  const consumer = state[consumerId];

  if (originator === "local") {
    consumer.locallyPaused = false;
  } else {
    consumer.remotelyPaused = false;
  }
};

const _setConsumerCurrentLayers: CaseReducer<
  IConsumerState,
  PayloadAction<{
    consumerId: string;
    spatialLayer: number;
    temporalLayer: number;
  }>
> = (state, action) => {
  const { consumerId, spatialLayer, temporalLayer } = action.payload;
  const consumer = state[consumerId];
  consumer.currentSpatialLayer = spatialLayer;
  consumer.currentTemporalLayer = temporalLayer;
};

const _setConsumerPreferredLayers: CaseReducer<
  IConsumerState,
  PayloadAction<{
    consumerId: string;
    spatialLayer: number;
    temporalLayer: number;
  }>
> = (state, action) => {
  const { consumerId, spatialLayer, temporalLayer } = action.payload;
  const consumer = state[consumerId];
  consumer.preferredSpatialLayer = spatialLayer;
  consumer.preferredTemporalLayer = temporalLayer;
};

const _setConsumerPriority: CaseReducer<
  IConsumerState,
  PayloadAction<{
    consumerId: string;
    priority: number;
  }>
> = (state, action) => {
  const { consumerId, priority } = action.payload;
  const consumer = state[consumerId];

  consumer.priority = priority;
};

const _setConsumerTrack: CaseReducer<
  IConsumerState,
  PayloadAction<{
    consumerId: string;
    track: types.Consumer["track"];
  }>
> = (state, action) => {
  const { consumerId, track } = action.payload;
  const consumer = state[consumerId];

  consumer.track = track;
};

const _setConsumerScore: CaseReducer<
  IConsumerState,
  PayloadAction<{
    consumerId: string;
    score: number;
  }>
> = (state, action) => {
  const { consumerId, score } = action.payload;
  const consumer = state[consumerId];

  consumer.score = score;
};

export const consumerSlice = createSlice({
  name: "consumer",
  reducers: {
    setRoomState: _setRoomState,
    addConsumer: _addConsumer,
    removeConsumer: _removeConsumer,
    setConsumerPause: _setConsumerPause,
    setConsumerResume: _setConsumerResume,
    setConsumerCurrentLayers: _setConsumerCurrentLayers,
    setConsumerPreferredLayers: _setConsumerPreferredLayers,
    setConsumerPriority: _setConsumerPriority,
    setConsumerTrack: _setConsumerTrack,
    setConsumerScore: _setConsumerScore,
  },
  initialState,

  extraReducers(builder) {
    builder.addCase(roomActions.setRoomState, (state, action) => {
      return _setRoomState(state, action);
    });
  },
});

export const consumerActions = consumerSlice.actions;
export const consumerAsyncActions = {};

export default consumerSlice.reducer;
