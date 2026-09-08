import userReducer from "./slice/userSlice";
import searchReducer from "./slice/searchSlice";
import ticketReducer from "./slice/ticketSlice";
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./slice/notificationSlice";

export const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    user: userReducer,
    search: searchReducer,
    tickets: ticketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;