import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IProducer } from "@/interfaces/store";
import { roomActions } from "./roomSlice";

interface IProducerState {
  [key: string]: IProducer;
}

const initialState: IProducerState = {};

const _setRoomState: CaseReducer<IProducerState, PayloadAction<{ state: string }>> = (_state, action) => {
  if (action.payload.state === "closed") {
    return {};
  }
};

const _addProducer: CaseReducer<IProducerState, PayloadAction<{ producer: IProducer }>> = (state, action) => {
  const { producer } = action.payload;

  state[producer.id] = producer;

  return state;
};

const _removeProducer: CaseReducer<IProducerState, PayloadAction<{ producerId: string }>> = (state, action) => {
  const { producerId } = action.payload;

  delete state[producerId];

  return state;
};

const _setProducerPaused: CaseReducer<IProducerState, PayloadAction<{ producerId: string }>> = (state, action) => {
  const { producerId } = action.payload;

  state[producerId].paused = true;
};

const _setProducerResumed: CaseReducer<IProducerState, PayloadAction<{ producerId: string }>> = (state, action) => {
  const { producerId } = action.payload;

  state[producerId].paused = false;
};

const _setProducerTrack: CaseReducer<IProducerState, PayloadAction<{ producerId: string; track: any }>> = (
  state,
  action
) => {
  const { producerId, track } = action.payload;

  state[producerId].track = track;
};

const _setProducerScore: CaseReducer<IProducerState, PayloadAction<{ producerId: string; score: number }>> = (
  state,
  action
) => {
  const { producerId, score } = action.payload;

  state[producerId].score = score;
};

export const producerSlice = createSlice({
  name: "producer",
  reducers: {
    setRoomState: _setRoomState,
    addProducer: _addProducer,
    removeProducer: _removeProducer,
    setProducerPaused: _setProducerPaused,
    setProducerResumed: _setProducerResumed,
    setProducerTrack: _setProducerTrack,
    setProducerScore: _setProducerScore,
  },
  initialState,
  extraReducers(builder) {
    builder.addCase(roomActions.setRoomState, (state, action) => {
      return _setRoomState(state, action);
    });
  },
});

export const producerActions = producerSlice.actions;
export const producerAsyncActions = {};

export default producerSlice.reducer;
