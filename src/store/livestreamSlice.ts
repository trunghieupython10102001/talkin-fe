import { ILivestreamRoomsParams, _checkLSRoomExists } from "@/api/livestream";
import { ILivestreamRoom } from "@/interfaces/type";
import { CaseReducer, PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

const checkLSRoomExitsAction = createAsyncThunk("livestream/check", async (roomId: string, { rejectWithValue }) => {
  try {
    const data = await _checkLSRoomExists(roomId);

    return data;
  } catch (error) {
    return rejectWithValue(error as AxiosError);
  }
});

interface ILivestreamState {
  livestreamDetail: ILivestreamRoom;
  params: ILivestreamRoomsParams;
  searchText: string;
  isFilter: boolean;
}

const initialState: ILivestreamState = {
  livestreamDetail: {
    id: "",
    name: "",
    startTime: "",
    description: "",
    creatorId: 0,
    listCategory: [],
    thumbnail: "",
    liveThumbnail: "",
    status: "",
    createdAt: "",
    updatedAt: "",
    peersCount: 0,
  },
  params: {
    status: "",
    page: 1,
    size: 9,
    "creator.fullname_like": "",
    name_like: "",
    listCategory_has: [],
    order_by: "desc",
    sort_by: "createAt",
  },

  searchText: "",
  isFilter: false,
};

const _setParams: CaseReducer<ILivestreamState, PayloadAction<ILivestreamRoomsParams>> = (state, action) => {
  state.params = { ...state.params, ...action.payload };
};

const _setSearchText: CaseReducer<ILivestreamState, PayloadAction<string>> = (state, action) => {
  state.searchText = action.payload;
};

const _setFilter: CaseReducer<ILivestreamState, PayloadAction<boolean>> = (state, action) => {
  state.isFilter = action.payload;
};

export const livestreamSlice = createSlice({
  name: "livestream",
  initialState,
  reducers: {
    setParams: _setParams,
    setSearchText: _setSearchText,
    setFilter: _setFilter,
  },
  extraReducers(builder) {
    builder.addCase(checkLSRoomExitsAction.fulfilled, (state, { payload }) => {
      state.livestreamDetail = payload;
    });
  },
});

export const livestreamActions = livestreamSlice.actions;
export const livestreamAsyncActions = {
  checkLSRoomExitsAction,
};

export default livestreamSlice.reducer;
