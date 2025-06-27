import { createApi } from "@reduxjs/toolkit/query/react";
import type { Message, MessagesList } from "../../interfaces";
import { socket } from "../../helpers/WebSocketManager";
import { fakeBaseQuery } from "@reduxjs/toolkit/query";

export const messageApi = createApi({
    reducerPath: 'messageApi',
    baseQuery: fakeBaseQuery(),
    endpoints: (build) => ({
        getMessages: build.query<MessagesList, void>({
            queryFn() {
                return { data: []}
            },
            async onCacheEntryAdded(
                _,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    await cacheDataLoaded;
                    await socket.getConnection();

                    const listener = (event: MessageEvent) => {
                        const data = JSON.parse(event.data);
                        updateCachedData((draft) => {
                            draft.push(data);
                        });
                    }

                    socket.addListener('message', listener);
                    
                    await cacheEntryRemoved;
                    socket.removeListener('message', listener);
                } catch (error) {
                    console.error('WebSocket error', error);
                }
            },
        }),
        sendMessage: build.mutation<Message, Message>({
            queryFn: async (message) => {
                try {
                    await socket.getConnection();
                    socket.send(message);
                    return { data: message };
                } catch (error) {
                    return { error: { message: "WebSocket send failed" } };
                }
            },
        })
    }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = messageApi;
