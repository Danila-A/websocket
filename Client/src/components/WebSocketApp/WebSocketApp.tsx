import { useState, type FormEvent } from "react";
import type { Message } from "../../interfaces";
import styles from './WebSocketApp.module.scss';
import { useGetMessagesQuery, useSendMessageMutation } from "../../store/Apis/messageApi";


export const WebSocketApp = () => {
    const [value, setValue] = useState('');
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('');
    const [sendMessage] = useSendMessageMutation();
    const { data: messages } = useGetMessagesQuery();

    const connect = (event: FormEvent) => {
        event.preventDefault();

        setConnected(true);
        const message = {
            event: 'connection',
            username,
            id: Date.now(),
        }
        sendMessage(message);
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const message: Message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message',
        }
        sendMessage(message);
        setValue('');
    }

    if (!connected) {
        return (
            <div className={styles.container}>
                <div className={styles.formContainer}>
                    <h3>Entry your name to get in the chat</h3>
                    <form onSubmit={(event) => connect(event)} className={styles.form}>
                        <input 
                        value={username} 
                        onChange={(event) => setUsername(event.target.value)}
                        type="text" 
                        placeholder="Введите ваше имя" 
                        className={styles.input} />
                        <button className={styles.button}>Войти</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h2>Welcome!</h2>
                <form onSubmit={(event) => handleSubmit(event)} className={styles.form}>
                    <input 
                    type="text" 
                    value={value} 
                    onChange={(event) => setValue(event.target.value)} 
                    className={styles.input} />
                    <button className={styles.button}>Send</button>
                </form>
            </div>
            <div className={styles.messages}>
                {messages?.map((item) => (
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
