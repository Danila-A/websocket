import { configureStore } from "@reduxjs/toolkit";
import { messageApi } from "./Apis/messageApi";

export const store = configureStore({
    reducer: {
        [messageApi.reducerPath]: messageApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(messageApi.middleware),
});
