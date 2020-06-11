/**
 * Communication with Proximity Manager
 */
const WebSocket = require('ws');

class Socket {
    constructor(url) {
        this.socketUrl = `${process.env.PROXIMITY_MANAGER}/${url}`;
        this.clientSocket = null;
        this.connect();

    }
    connect() {
        this.clientSocket = new WebSocket(this.socketUrl);

        this.clientSocket.onclose = () => this.connect();
    }

    send(data) {
        return new Promise((resolve, reject) => {
            console.log("DATA: " + data)
            let info = {
                id: data.id,
                coordinates: {
                    latitude: data.latitude,
                    longitude: data.longitude
                },
                action: data.action ? data.action : undefined
            };
            console.log("SOCKET SENDING: " + JSON.stringify(info))
            this.clientSocket.send(JSON.stringify(info));

            this.clientSocket.onmessage = (message) => {
                resolve(message.data);
            }
        })
    }
}


module.exports = Socket;