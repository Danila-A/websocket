import type { Message } from "../interfaces";

class WebSocketManager {
    private socket: WebSocket | null = null;
    private url: string | null = null;
    public connection: Promise<unknown> | null = null;
    private currentReconnectAttempt: number = 0;
    private maxReconnectAttempts: number = 3;
    private reconnectDelay: number = 2000;
    private delayFactor: number = 2 ** this.currentReconnectAttempt;

    constructor(url: string) {
        this.url = url;
        this.connect();
    }

    getConnection() {
        if (this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING) {
            return this.connection;
        }
        this.connect();
        return this.connection;
    }

    connect() {
        if(!this.url) return;

        this.socket = new WebSocket(this.url);
        this.connection = this.widthTimeout(new Promise((resolve, reject) => {
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
            console.warn("We can't to connect to websocket");
            return;
        }

        const delay = this.reconnectDelay * this.delayFactor;

        this.currentReconnectAttempt++;
        console.info(`Reconnecting in ${delay / 1000}s`);
        this.connect();
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
