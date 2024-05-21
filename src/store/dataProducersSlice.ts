import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IDataProducer } from "@/interfaces/store";

interface IProducerState {
  [key: string]: IDataProducer;
}

const initialState = {};

const _setRoomState: CaseReducer<
  IProducerState,
  PayloadAction<{ state: string }>
> = (_state, action) => {
  if (action.payload.state === "closed") {
    return {};
  }
};

const _addDataProducer: CaseReducer<
  IProducerState,
  PayloadAction<{ dataProducer: IDataProducer }>
> = (state, action) => {
  const { dataProducer } = action.payload;

  state[dataProducer.id] = dataProducer;
};

const _removeDataProducer: CaseReducer<
  IProducerState,
  PayloadAction<{ dataProducerId: string }>
> = (state, action) => {
  const { dataProducerId } = action.payload;

  delete state[dataProducerId];

  return state;
};

export const dataProducerSlice = createSlice({
  name: "dataProducer",
  reducers: {
    setRoomState: _setRoomState,
    addDataProducer: _addDataProducer,
    removeDataProducer: _removeDataProducer,
  },
  initialState,
});

export const dataProducerActions = dataProducerSlice.actions;
export const dataProducerAsyncActions = {};

export default dataProducerSlice.reducer;
