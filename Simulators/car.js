const WebSocket = require('ws');
const routes = require('./travellingRoutes');
const { v4: uuidv4 } = require('uuid');
const Point = require('./Point')


class car{
    
    constructor(points, breakVelocity, standardVelocity){
        this.breakVelocity = breakVelocity;
        this.standardVelocity = standardVelocity;
        this.mr = new routes.MultipleRoute()
        for(let i = 0; i < points.length-1; i++){
            let start = points[i]
            let end =  points[i+1]
            console.log("START: " + JSON.stringify(start))
            console.log("END: " + JSON.stringify(end))
            let route = new routes.Route(start, end, standardVelocity)
            this.mr.addRoute(route)
        }
        this.socketUrl = 'ws://localhost:4040/manager/car';
    }
    
    run(){
        const socketConnection = new WebSocket(this.socketUrl);
        const userId = uuidv4();
        const car = this;
        socketConnection.onopen = async function(e) {
            // Server: Sure, WebSocket!
        //  console.dir(e);
            console.log("Connection Open");
        
            // socketConnection.send(JSON.stringify(carGPS));
        
            // Start and End, Speed
            //Primeiro cenário: Passa carro e passa pedestres sem parar ou pausas
            /*let r1 = new routes.Route({latitude: 41.560939585919584, longitude: -8.404479384422299}, {
                latitude: 41.56011525503568, longitude: -8.406928181648254
            }, 10)*/

            //segundo cenário: Abrandar
            /*let r1 = new routes.Route({latitude: 41.560590373181626, longitude: -8.405562996864315}, {
                latitude: 41.56011525503568, longitude: -8.406928181648254
            }, 10)*/

            //terceiro cenário: Parar na passadeira e depois arrancar
            while (!car.mr.completed()) {
                await timeout(car.mr, 100);
            }
            socketConnection.send(JSON.stringify({id: userId, action: "close"}));
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
            let notification = event.data
            notification = JSON.parse(notification)

            if(notification && notification.code){
                if(notification.code === "green"){
                    car.mr.setVelocity(car.standardVelocity)
                } else if(notification.code === "red"){
                    console.log("devia parar")
                    car.mr.setVelocity(0);
                } else if(notification.code === "orange"){
                    console.log("vai reduzir velocidade")
                    car.mr.setVelocity(car.breakVelocity)
                } else {
                    console.log("unkown code " +  notification.code)
                }
            } else {
                console.log("unkown message " +  JSON.stringify(notification))
            }
            console.log(`Car Data Recevied: ${event.data}`);
        };
        
        socketConnection.onerror = function(error) {
            console.log("vai paarar?")
            car.mr.stopRoute()
        };
    }
}

module.exports = car;