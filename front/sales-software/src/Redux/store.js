import { configureStore } from "@reduxjs/toolkit";
import { QueryClient } from "@tanstack/react-query";
import { userApi } from "./CreateUserSlice";
import { leadApi } from "./LeadSlice";
import { notesApi } from "./notes";


export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [leadApi.reducerPath]: leadApi.reducer, 
    [notesApi.reducerPath]: notesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware,leadApi.middleware,notesApi.middleware),
  // devTools: process.env.NODE_ENV !== "production",  Enable Redux DevTools
});

export const queryClient = new QueryClient();

export default store;
