import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IDataConsumer } from "@/interfaces/store";
import { roomActions } from "./roomSlice";

interface IDataConsumerState {
  [key: string]: IDataConsumer;
}

const initialState: IDataConsumerState = {};

const _setRoomState: CaseReducer<IDataConsumerState, PayloadAction<{ state: string }>> = (_state, action) => {
  if (action.payload.state === "closed") {
    return {};
  }
};

const _addDataConsumer: CaseReducer<
  IDataConsumerState,
  PayloadAction<{ dataConsumer: IDataConsumer; peerId: string }>
> = (state, action) => {
  const { dataConsumer } = action.payload;

  state[dataConsumer.id] = dataConsumer;
};

const _removeDataConsumer: CaseReducer<
  IDataConsumerState,
  PayloadAction<{ dataConsumerId: string; peerId: string }>
> = (state, action) => {
  const { dataConsumerId } = action.payload;

  delete state[dataConsumerId];

  return state;
};

export const dataConsumerSlice = createSlice({
  name: "dataConsumer",
  reducers: {
    setRoomState: _setRoomState,
    addDataConsumer: _addDataConsumer,
    removeDataConsumer: _removeDataConsumer,
  },
  initialState,
  extraReducers(builder) {
    builder.addCase(roomActions.setRoomState, (state, action) => {
      return _setRoomState(state, action);
    });
  },
});

export const dataConsumerActions = dataConsumerSlice.actions;
export const dataConsumerAsyncActions = {};

export default dataConsumerSlice.reducer;
