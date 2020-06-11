class MultipleRoute{
    constructor() {
        this.routes = []
        this.lastFinished = 0;
        this.isFinished = false;
        this.isRunning = true;
    }

    addRoute(route){
        this.routes.push(route)
    }

    completed(){
        return this.isFinished
    }

    processTime(ms){
        let route = this.routes[this.lastFinished];
        if(route){
            if(!this.isRunning) return route.processTime(ms);

            let coords = route.processTime(ms)
            //.log(JSON.stringify(coords))
            if(route.completed()){
                console.log("Finished rout " + this.lastFinished)
                this.lastFinished++
                if(this.routes[this.lastFinished])
                    this.isFinished = true;
            }
            return coords;
        } else {
            this.isFinished = true;
            return null;
        }
    }

    stopRoute(){
        this.isRunning = false;
    }

    continueRoute(){
        this.isRunning = true;
    }

    getVelocity(){
        if(this.routes[this.lastFinished])
            return this.routes[this.lastFinished].velocity
        return -1;
    }

    setVelocity(newVelocity){
        if(this.routes[this.lastFinished])
            this.routes[this.lastFinished].setVelocity(newVelocity)
    }
}



class Route{
    constructor(start, end, velocity) {
        this.start = start
        this.end = end
        this.dla = end.latitude  - start.latitude
        this.dlo = end.longitude - start.longitude
        this.velocity = velocity
        this.currentLatitude = start.latitude
        this.currentLongitude = start.longitude
        this.currentTimePassed = 0;
        this.isFinished = false;
        this.isRunning = true;
    }

    completed(){
        return this.isFinished
    }

    reset(){
        this.currentLatitude = start.latitude
        this.currentLongitude = start.longitude
        this.currentTimePassed = 0;
        this.isFinished = false;
    }

    processTime(ms){
        if(!this.isRunning) return {latitude: this.currentLatitude, longitude: this.currentLongitude};

        this.currentTimePassed += ms
        let lastTravelled = this.velocity * (ms / 1000)
        let percentage = this.currentPercentage(lastTravelled)
        if(percentage >= 1){
            this.isFinished = true;
            return this.end;
        } else {
            this.currentLatitude = this.start.latitude + this.dla * percentage
            this.currentLongitude = this.start.longitude + this.dlo * percentage
            //console.log(this.currentLatitude, this.currentLongitude)
            return {latitude: this.currentLatitude, longitude: this.currentLongitude}
        }
    }

    stopRoute(){
        this.isRunning = false;
    }

    continueRoute(){
        this.isRunning = true;
    }

    currentPercentage(lastTravelled){
        let totalMeters = getDistanceFromLatLon(this.start.latitude, this.start.longitude,
            this.end.latitude, this.end.longitude)
        let currentMetersTravelled = getDistanceFromLatLon(this.start.latitude, this.start.longitude,
            this.currentLatitude, this.currentLongitude)
        return (currentMetersTravelled + lastTravelled) / totalMeters
    }

    getVelocity(){
        return this.velocity
    }

    setVelocity(newVelocity){
        this.velocity = newVelocity
    }
}


function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function getDistanceFromLatLon(lat1,lon1,lat2,lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lon2-lon1);
    let a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c; // Distance in km
    return d * 1000;
}


module.exports = {MultipleRoute, Route}
/*
let r1 = new Route({latitude: 41.54350, longitude: -8.42894},
    {latitude: 41.54296, longitude: -8.43024},
    10 )

let r2 = new Route({latitude: 41.54296, longitude: -8.43024},
    {latitude: 41.54350, longitude: -8.42894},
    10 )


let mr = new MultipleRoute()
mr.addRoute(r1)
mr.addRoute(r2)

let timeout = (mr, ms) => {
    return new Promise(resolve => setTimeout(function () {
        mr.processTime(ms)
        resolve()
    }, ms))
}

async function run() {
    let i = 0
    while (!mr.completed()) {
        await timeout(mr, 200)
        i++
        if(i === 10){
            console.log("Stopped")
            mr.stopRoute();
        }
        if(i === 100){
            console.log("Continued")
            mr.continueRoute();
        }
    }
}

run()
    .then(d => console.log("finished simulation"))
    .catch(err => console.log(err))


*/


