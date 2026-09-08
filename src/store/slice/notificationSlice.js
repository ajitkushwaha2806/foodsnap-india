import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: {
      reducer(state, action) {
        state.notifications = [action.payload];
      },
      prepare({ id, type = "info", message, duration = 4000, action = null, notification_type = "", icon = null }) {
        return {
          payload: {
            id: id || nanoid(),
            type,
            message,
            duration,
            action,
            notification_type,
            icon,
          },
        };
      },
    },

    removeNotification(state, action) {
      if (action.payload) {
        state.notifications = state.notifications.filter(
          (n) => n.id !== action.payload
        );
      } else {
        state.notifications = [];
      }
    },

    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
