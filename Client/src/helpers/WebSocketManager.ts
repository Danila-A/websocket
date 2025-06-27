import type { Message } from "../interfaces";

class WebSocketManager {
    private socket: WebSocket | null = null;
    private url: string | null = null;
    public connected: Promise<unknown> | null = null;
    private currentReconnectAttempt: number = 0;
    private maxReconnectAttempts: number = 3;
    private reconnectDelay: number = 2000;

    constructor(url: string) {
        this.url = url;
        this.connect();
    }

    connect() {
        if(!this.url) return;

        this.socket = new WebSocket(this.url);
        this.connected = this.widthTimeout(new Promise((resolve, reject) => {
            if (this.socket) {
                this.socket.onopen = () =>  resolve(true);
                this.socket.onerror = (error) => reject(error);
            }
        }), 5000)
        .catch(() => {
            this.reconnect();
        });
    }

    private widthTimeout<T>(promise: Promise<T>, timeout: number) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(false), timeout);
            promise
            .then(() => {
                clearTimeout(timer);
                this.currentReconnectAttempt = 0;
                resolve(true);
            })
            .catch((error) => {
                clearTimeout(timer);
                reject(error);
            })
        })
    }

    reconnect() {
        if (this.currentReconnectAttempt >= this.maxReconnectAttempts) {
            console.log("We can't to connect to websocket");
            return;
        }

        const delay = this.reconnectDelay * 2 ** this.currentReconnectAttempt;

        this.currentReconnectAttempt++;
        console.log(`Reconnecting in ${delay / 1000}s`);
        this.connect();
    }

    getConnected() {
        return this.connected;
    }

    send(message: Message) {
        if (this.socket) this.socket.send(JSON.stringify(message));
    }

    addListener(event: string, listener: (data: any) => void) {
        if (this.socket) this.socket.addEventListener(event, listener);
    }

    removeListener(event: string, listener: (data: any) => void) {
        if (this.socket) this.socket.removeEventListener(event, listener);
    }
}

export const socket = new WebSocketManager('ws://localhost:5000');
