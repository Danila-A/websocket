import { createApi } from "@reduxjs/toolkit/query/react";
import type { Message, MessagesList } from "../../interfaces";
import { socket } from "../../helpers/WebSocketManager";

export const messageApi = createApi({
    reducerPath: 'messageApi',
    async baseQuery (data: Message) {
        socket.connect;
        await socket.getConnected();
        socket.send(data);
        return { data };
    },
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
                    await socket.getConnected();

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
            query(event) {
                return event;
            }
        })
    }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = messageApi;
