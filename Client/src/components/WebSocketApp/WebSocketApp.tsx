import { useState, type FormEvent } from "react";
import { useRef } from "react";
import type { Message, MessagesList } from "../../interfaces";
import styles from './WebSocketApp.module.css';


export const WebSocketApp = () => {
    const [messages, setMessages] = useState<MessagesList | []>([]);
    const [value, setValue] = useState('');
    const socket = useRef<WebSocket>(null);
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('');

    const connect = (event: FormEvent) => {
        event.preventDefault();

        socket.current = new WebSocket('ws://localhost:5000');

        socket.current.onopen = () => {
            setConnected(true);
            const message = {
                event: 'connection',
                username,
                id: Date.now(),
            }
            socket.current && socket.current.send(JSON.stringify(message));
        }

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prev) => {
                return [message, ...prev];
            });
        }

        socket.current.onclose = () => {
            console.log('The server is closed');
            setConnected(false);
        }

        socket.current.onerror = () => {
            console.log('An error has occurred');
        }
    }

    const sendMessage = (event: FormEvent) => {
        event.preventDefault();
        const message: Message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message',
        }
        socket.current && socket.current.send(JSON.stringify(message));
        setValue('');
    }

    if (!connected) {
        return (
            <div className={styles.container}>
                <div className={styles.formContainer}>
                    <form onSubmit={(event) => connect(event)} className={styles.form}>
                        <input 
                        value={username} 
                        onChange={(event) => setUsername(event.target.value)}
                        type="text" 
                        placeholder="Введите ваше имя" />
                        <button className={styles.button}>Войти</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <form onSubmit={(event) => sendMessage(event)} className={styles.form}>
                    <input 
                    type="text" 
                    value={value} 
                    onChange={(event) => setValue(event.target.value)} 
                    className={styles.input} />
                    <button className={styles.button}>Send</button>
                </form>
            </div>
            <div className={styles.messages}>
                {messages.map((item) => (
                    <div key={item.id}>
                        {item.event === 'connection'
                            ? <div className={styles.connectionMessage}>Пользователь {item.username} подключился</div>
                            : <div className={styles.message}>{item.username}: {item.message}</div>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
}
