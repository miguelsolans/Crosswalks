const WebSocket = require('../Socket');
const express = require('express');
const app = express.Router();


var carSockets = [],
    pedestrianSockets = [],
    notificationSockets = null;

var socketsMap = new Map();
var isCarMap = new Map();
var appCarSocket = null;
var appPedSocket = null;

var carManager = new WebSocket('car/update');
carManager.connect();
var pedestrianManager = new WebSocket('pedestrian/update')
pedestrianManager.connect();

var notifications = [];


/**
 * Car Simulator to Backend
 */
app.ws('/car', async (ws, req) => {
    console.log("Car Socket Request");
    carSockets.push(ws);
    // id,
    // latitude,
    // longitude,
    // car: true : false
    ws.on('message', async msg => {
        console.log(" ======== Car ========");
        //const coordinates = JSON.parse(msg);
        //console.log(msg);
        // ws.send("Car Updated");
        let data = JSON.parse(msg);
        if(socketsMap.get(data.id) === undefined){
            socketsMap.set(data.id, ws)
        }
        if(isCarMap.get(data.id) === undefined){
            isCarMap.set(data.id, true)
        }
        if(data.action && data.action === "close"){
            handleVoluntaryDisconnect(data)
            return;
        }
        handleCoordinates(data);

        console.log("SENDING DATA: " + JSON.stringify(data))
        let notification = JSON.parse(await carManager.send(data))
        //console.log("---- NOTIFICATION ----");

        for(let noti of notification){
            handleNotification(noti)
        }
    });

    ws.on('closed', () => {
        carSockets = carSockets.filter(client => ws._socket._peername.port !== client._socket._peername.port);
    })
});


app.ws('/pedestrian', async (ws, req) => {
    console.log("Pedestrian Socket Request");

    pedestrianSockets.push(ws);

    ws.on('message', async msg => {
        console.log(" ======== Pedestrian ========");
        //console.log(msg);
        let data = JSON.parse(msg);
        if(data.action && data.action === "close"){
            handleVoluntaryDisconnect(data)
            return;
        }
        if(socketsMap.get(data.id) === undefined){
            socketsMap.set(data.id, ws)
        }
        if(isCarMap.get(data.id) === undefined){
            isCarMap.set(data.id, false)
        }
        handleCoordinates(data);
       // console.log("pedestrianManager: " + pedestrianManager )
        console.log("SENDING DATA: " + JSON.stringify(data))
        let notification = JSON.parse(await pedestrianManager.send(data))
        //console.log("---- NOTIFICATION ----");

        for(let noti of notification){
            handleNotification(noti)
            //handleNotification(noti)
        }

    });

    ws.on('closed', () => {
        clientSockets = clientSockets.filter(client => ws._socket._peername.port !== client._socket._peername.port);
    });

});

app.ws('/notifications', (ws, req) => {
    // Socket Accepted
    console.log("Notifications Requested");
    ws.on('closed', () => {
        console.log("Client Closed");
        notificationSockets = null;
    });

    notificationSockets = ws;

});

app.ws('/app/cars', (ws, req) => {
    // Socket Accepted
    console.log("Cars positions Requested");
    ws.on('closed', () => {
        console.log("Client Closed");
        appCarSocket = null;
    });
    appCarSocket = ws;
});

app.ws('/app/pedestrians', (ws, req) => {
    // Socket Accepted
    console.log("Cars positions Requested");
    ws.on('closed', () => {
        console.log("Client Closed");
        appPedSocket = null;
    });
    appPedSocket = ws;
});

function handleNotification(notification) {
    console.log("===== Handle Notification =====")
    console.log("Client ID: " + notification.id)
    if(notificationSockets !== null) {
        console.log(notification);
        notificationSockets.send(JSON.stringify(notification));
        console.log("notification sent")
    }
    let socket = socketsMap.get(notification.id)
    console.log("socket: " + socket !== undefined)
    if(socket !== undefined && !socket._closeFrameReceived){
        socket.send(JSON.stringify(notification));
    }
}

function handleCoordinates(msg){
    let isCar = isCarMap.get(msg.id)
    console.log(msg)
    if(isCar !== undefined){
        if(isCar && appCarSocket){
            appCarSocket.send(JSON.stringify(msg))
        } else if(appPedSocket){
            appPedSocket.send(JSON.stringify(msg))
        }
    }
}

function handleVoluntaryDisconnect(data){
    let isCar = isCarMap.get(data.id)
    let toSend = JSON.stringify(data)
    console.log("Is car " + (isCar))
    if(isCar) {
        if (isCar === true && appCarSocket) {
            console.log("Sent through AppCar: " + toSend)
            appCarSocket.send(toSend)
        } else if(appPedSocket) {
            console.log("Sent through AppPed: " + toSend)
            appPedSocket.send(toSend)
        }
    }
    console.log((appPedSocket !== undefined) + " " + (appCarSocket !== undefined))
    console.log("TO CAR MANAGER: " + toSend)
    carManager.send(data)
}

module.exports = app;