import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit";

import { IFormLogin, IFormRegister, IProfile } from "@/interfaces/type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { _login, _register } from "@/api/auth";
import { getProfile } from "@/api/profile";
import { COOKIES_STORAGE_KEY } from "@/constants";

import Cookies from "js-cookie";

const loginAction = createAsyncThunk("/auth/login", async (params: IFormLogin, { rejectWithValue }) => {
  try {
    const data = await _login(params);
    return { data: data };
  } catch (error) {
    return rejectWithValue(error);
  }
});

const registerAction = createAsyncThunk("/auth/signup", async (params: IFormRegister, { rejectWithValue }) => {
  try {
    await _register(params);
  } catch (error) {
    return rejectWithValue(error);
  }
});

const logoutAction: CaseReducer<IAuthState, PayloadAction> = (state, action) => {
  state.access_token = "";
  state.isLogged = false;
  Cookies.remove(COOKIES_STORAGE_KEY.ACCESS_TOKEN);
};

const signUpSuccessAction: CaseReducer<IAuthState, PayloadAction> = (state, action) => {
  state.isSuccessRegistered = true;
};

const getProfileAction = createAsyncThunk("/auth/profile", async (args, { getState, rejectWithValue }) => {
  try {
    const data = await getProfile();
    return data.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

interface IAuthState {
  isLogged: boolean;
  access_token: string;
  profile: IProfile;
  isSuccessRegistered: boolean;
}

const accessToken = Cookies.get(COOKIES_STORAGE_KEY.ACCESS_TOKEN) ?? "";

const initialState: IAuthState = {
  isLogged: Boolean(accessToken),
  access_token: accessToken,
  profile: {
    id: 0,
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    birthday: "",
    gender: "",
    phone: "",
    address: "",
    avatar: "",
    description: "",
    createdAt: "",
    updatedAt: "",
    wallet: "",
  },
  isSuccessRegistered: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutAction,
    signUpSuccessAction,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAction.fulfilled, (state, { payload }) => {
        state.isLogged = true;
        Cookies.set(COOKIES_STORAGE_KEY.ACCESS_TOKEN, payload.data.access_token);
      })
      .addCase(getProfileAction.fulfilled, (state, { payload }) => {
        state.profile = payload;
      });
  },
});

export const authActions = authSlice.actions;
export const authAsyncActions = {
  loginAction,
  registerAction,
  getProfileAction,
};

export default authSlice.reducer;
