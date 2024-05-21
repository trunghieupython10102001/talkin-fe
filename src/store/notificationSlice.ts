import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { INotification } from "@/interfaces/store";

interface INotificationState {
  notifications: INotification[];
}

const initialState: INotificationState = {
  notifications: [],
};

const _addNotification: CaseReducer<
  INotificationState,
  PayloadAction<{ notification: INotification }>
> = (state, action) => {
  state.notifications.push(action.payload.notification);
};

const _removeNotification: CaseReducer<
  INotificationState,
  PayloadAction<{ notificationId: INotification["id"] }>
> = (state, action) => {
  state.notifications.splice(
    state.notifications.findIndex(
      (notification) => notification.id === action.payload.notificationId
    ),
    1
  );
};

const _deleteAllNotification: CaseReducer<
  INotificationState,
  PayloadAction<void>
> = (state, _action) => {
  state.notifications = [];
};

export const notificationSlice = createSlice({
  name: "notification",
  reducers: {
    addNotification: _addNotification,
    removeNotification: _removeNotification,
    deleteAllNotification: _deleteAllNotification,
  },
  initialState,
});

export const notificationActions = notificationSlice.actions;
export const notificationAsyncActions = {};

export default notificationSlice.reducer;
