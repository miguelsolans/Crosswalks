const express = require('express');
const app = express.Router();

const Cars = require('../controllers/Cars');
const Pedestrians = require('../controllers/Pedestrians');

const Utils = require('../utils');

app.ws('/update', async (ws, req) => {

    /**
     * Receives Current Coordinates Update
     * msg: id, coordinates {latitude, longitude}
     */
    ws.on('message', async msg => {
        //console.log("==== Pedestrian Update ====");
        let request = JSON.parse(msg);
        if(request.action !== undefined && request.action == "close"){
            await Pedestrians.cleanPedestrian(request.id)
            return;
        }

        let ray = 10; //meters
        let closeRange = 5; //meters

        let body = Utils.getIdWithCoords(request);
        try {
            await Pedestrians.addPedestrian(body);
            let pedestrian = await Pedestrians.getPedestrian(body.id);
            let crosswalks = await Utils.filterCrosswalksByRange(ray, closeRange, pedestrian.coordinates);
            let notifications = [];
            for (let cw of crosswalks.longRange) {
                let pedestrians = await Pedestrians.addPedestrianToCrossWalk(pedestrian.id, cw.oid);
                let cars = await Cars.getCarsInCrosswalk(cw.oid);
                for (let carId of cars)
                    notifications.push({
                        id: carId, code: "orange",
                        message: "Pedestrians near the following crosswalk " + cw.oid
                    })
            }
            for (let cw of crosswalks.closeRange) {
                await Pedestrians.addPedestrianToCrossWalk(pedestrian.id, cw.oid);
                let cars = await Cars.getCarsInCrosswalk(cw.oid);
                for (let carId of cars) {
                    let car = await Cars.getCar(carId)
                    console.log("CarCoords: " + JSON.stringify(car))
                    console.log("CrossWalk: " + JSON.stringify(cw))
                    let dist = await Utils.getDistanceFromLatLon(car.coordinates.latitude
                        , car.coordinates.longitude, cw.LatS, cw.LongS)
                    console.log("DIST: " + dist)
                    if(dist <= 20)
                        notifications.push({
                            id: carId, code: "red",
                            message: "Pedestrians are in crosswalk " + cw.oid
                        })
                    else {
                        notifications.push({
                            id: carId, code: "orange",
                            message: "Pedestrians are in crosswalk " + cw.oid
                        })
                    }
                }
                if (cars.length === 0) {
                    notifications.push({
                        id: pedestrian.id, code: "green",
                        message: "No cars in crosswalk " + cw.oid
                    })
                } else {
                    notifications.push({
                        id: pedestrian.id, code: "orange",
                        message: "Careful, cars nearby the crosswalk " + cw.oid
                    })
                }
            }
            for (let cw of crosswalks.notInRange) {
                let pedestrians = await Pedestrians.addPedestrianToCrossWalk(pedestrian.id, cw.oid);
                //console.log("Pedestrians: " + pedestrians)
                if(crosswalks.closeRange.length === 0 && crosswalks.longRange.length === 0){
                    let cars = await Cars.getCarsInCrosswalk(cw.oid);
                    for (let carId of cars)
                        if(await Cars.getCarState(carId) != "green"){
                            notifications.push({
                                id: carId, code: "green",
                                message: "No pedestrians nearby"
                            })
                            await Cars.setCarState(carId, "green")
                        }
                }
            }
            let response = JSON.stringify(notifications);
            console.log("Response: " + response)
            ws.send(response);
        } catch(err) {
            let response = {
                code: 500,
                err
            };
            console.log(err);
            ws.send(JSON.stringify(response));
        }

    });

});

module.exports = app;