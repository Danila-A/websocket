export interface Message {
    id: number;
    message?: string;
    username: string;
    event: string;
}

export type MessagesList = Message[];

export type Listener = (data: any) => void;
