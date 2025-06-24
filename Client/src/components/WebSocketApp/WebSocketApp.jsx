import { useState } from "react";
import { useRef } from "react";


export const WebSocketApp = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef();
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('');

    const connect = () => {
        socket.current = new WebSocket('ws://localhost:5000');

        socket.current.onopen = () => {
            setConnected(true);
            const message = {
                event: 'connection',
                username,
                id: Date.now(),
            }
            socket.current.send(JSON.stringify(message));
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

    const sendMessage = () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message',
        }
        socket.current.send(JSON.stringify(message));
        setValue('');
    }

    if (!connected) {
        return (
            <div className="">
                <div className="">
                    <input 
                        value={username} 
                        onChange={(event) => setUsername(event.target.value)} 
                        type="text" 
                        placeholder="Введите ваше имя" />
                    <button onClick={connect}>Войти</button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="form">
                <input 
                    type="text" 
                    value={value} 
                    onChange={(event) => setValue(event.target.value)} />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div className="messages">
                {messages.map((item) => (
                    <div key={item.id}>
                        {item.event === 'connection'
                            ? <div className="connection_message">Пользователь {item.username} подключился</div>
                            : <div className="message">{item.username}: {item.message}</div>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
}
