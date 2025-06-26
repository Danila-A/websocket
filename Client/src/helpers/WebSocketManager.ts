import type { Message } from "../interfaces";

class WebSocketManager {
    private socket: WebSocket | null = null;
    private url: string | null = null;
    public connected: Promise<boolean> | null = null;
    private currentReconnectAttempt: number = 0;
    private maxReconnectAttempts: number = 3;

    constructor(url: string) {
        this.socket = new WebSocket(url);
        this.url = url;
    }

    connect() { 
        this.connected = new Promise<boolean>((resolve, reject) => {
            if (this.socket) {
                this.socket.onopen = () =>  resolve(true);
                this.socket.onerror = () => reject(false);
            }
        });
        this.connected.catch(() => {
            this.reconnect();
        });
    }

    getConnected() {
        return this.connected;
    }

    addListener(event: string, listener: (data: any) => void) {
        if (this.socket) this.socket.addEventListener(event, listener);
    }

    removeListener(event: string, listener: (data: any) => void) {
        if (this.socket) this.socket.removeEventListener(event, listener);
    }

    reconnect() {
        if (this.url && this.socket && (this.currentReconnectAttempt < this.maxReconnectAttempts)) {
            this.currentReconnectAttempt++;
            console.log('reconnecting...');
            this.socket = new WebSocket(this.url);
            this.connect();
        } else {
            console.log("We can't to connect to websocket");
        }

    }

    send(message: Message) {
        if (this.socket) this.socket.send(JSON.stringify(message));
    }
}

export const socket = new WebSocketManager('ws://localhost:5000');
