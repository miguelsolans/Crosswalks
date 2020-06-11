const WebSocket = require('ws');
const socketUrl = 'ws://localhost:4040/manager/car';
const socketConnection = new WebSocket(socketUrl);
const routes = require('./travellingRoutes');
const { v4: uuidv4 } = require('uuid');

const userId = uuidv4();

console.log(`Simulation for ID: ${userId}`);

const Point = require('./Point');

// Actual GPS position
const pointA = new Point(0, 0);

// Crosswalk Nearby Point
const nearbyCrossalk = new Point(0, 0);


async function changePosition(socketConnection) {
    let startLatitude = 41.54350;
    let startLongitude = -8.42894;

    let endLatitude = 41.54296;
    let endLongitude = -8.43024;

    let currentLatitute = startLatitude;
    let currentLongitude = startLongitude;

    let dla = startLatitude - endLatitude;
    let dlo = startLongitude - endLongitude;
    let percurso = 0;

    let timeout = (ms) => {
        return new Promise(resolve => setTimeout(function () {
            currentLatitute = startLatitude + dla * percurso;
            currentLongitude = startLatitude + dlo * percurso;

            currentPosition = new Point(currentLatitute, currentLongitude);


            console.log(currentLatitute, currentLongitude);
            // emit(currentPosition);
            socketConnection.send(JSON.stringify(currentPosition));

            // socketConnection.close();
            resolve(currentPosition);
        }, ms))
    }

    console.log("Starting");
    while (percurso <= 1){
        await timeout(2000);
        percurso+= 0.1;
    }
}


// Hey, let's talk?
socketConnection.onopen = async function(e) {
    // Server: Sure, WebSocket!
//  console.dir(e);
    console.log("Connection Open");

    // socketConnection.send(JSON.stringify(carGPS));
    let mr = new routes.MultipleRoute()
    /*let r1 = new routes.Route({latitude: 41.54350, longitude: -8.42894},
        {latitude: 41.54296, longitude: -8.43024},
        10 );*/

    // Start and End, Speed
    let r1 = new routes.Route({latitude: 41.560502602932594, longitude: -8.4057480096817}, {
        latitude: 41.56011525503568, longitude: -8.406928181648254
    }, 10)
    mr.addRoute(r1);


    while (!mr.completed()) {
        await timeout(mr, 50);
    }

    socketConnection.close();
};

let timeout = (mr, ms) => {
    return new Promise(resolve => setTimeout(function () {
        let coords = mr.processTime(ms)
        if(coords){
            let point = new Point(userId, coords.latitude, coords.longitude, true)
            socketConnection.send(JSON.stringify(point));
        }
        resolve();
    }, ms))
};

socketConnection.onmessage = function(event) {
    console.log(`Data Recevied: ${event.data}`);
};

socketConnection.onerror = function(error) {
    console.log("error!");
};
