import {WebSocketServer} from 'ws';

const wss = new WebSocketServer({
    port: 5000,
}, () => console.log('Server started on 5000'));

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        message = JSON.parse(message);
        switch (message.event) {
            case 'message':
                sendMessageEveryClients(message);
                break;
            case 'connection':
                sendMessageEveryClients(message);
                break;
        }
    });
});

function sendMessageEveryClients(message) {
    wss.clients.forEach((client) => {
        client.send(JSON.stringify(message));
    });
}
