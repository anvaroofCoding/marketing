import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services/api"; // API faylni keyin yaratamiz

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
