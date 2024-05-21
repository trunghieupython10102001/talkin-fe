import { _createInviteLink, _joinCall } from "@/api/invite";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

const inviteLinkAction = createAsyncThunk("invite/link", async (_, { rejectWithValue }) => {
  try {
    const data = await _createInviteLink();
    return { data: data };
  } catch (error) {
    return rejectWithValue(error);
  }
});

const joinMeetingAction = createAsyncThunk("invite/join", async (roomId: string, { rejectWithValue }) => {
  try {
    const data = await _joinCall(roomId);

    return { data: data };
  } catch (error) {
    return rejectWithValue(error as AxiosError);
  }
});

interface IInviteState {
  roomId: string;
  roomName: string;
  codeError: string;
}

const initialState: IInviteState = {
  roomId: "",
  roomName: "",
  codeError: "",
};

export const inviteSlide = createSlice({
  name: "invite",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(inviteLinkAction.fulfilled, (state, { payload }) => {
      state.roomId = payload.data.id;
    });
    builder.addCase(joinMeetingAction.fulfilled, (state, { payload }) => {
      state.roomName = payload.data.name;
    });
    builder.addCase(joinMeetingAction.rejected, (state, actions: any) => {
      state.codeError = actions.payload.response.data.code;
    });
  },
});

export const inviteAsynAction = {
  inviteLinkAction,
  joinMeetingAction,
};

export default inviteSlide.reducer;
