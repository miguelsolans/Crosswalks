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
        //console.log("==== CAR Update ====");
        let request = JSON.parse(msg);
        console.log("REQUEST: " + msg  + "; " + (request.action !== undefined));
        if(request.action !== undefined && request.action == "close"){
            await Cars.cleanCar(request.id)
            return;
        }
        let ray = 100; //meters
        let closeRange = 40; //meters
        let body = Utils.getIdWithCoords(request);
        try {
            await Cars.addCar(body);
            let car = await Cars.getCar(body.id);
            let carState = await Cars.getCarState(body.id);
            let crosswalks = await Utils.filterCrosswalksByRange(ray, closeRange, car.coordinates);
            let notifications = [];
            for (let cw of crosswalks.longRange) {
                await Cars.addCarToCrossWalk(car.id, cw.oid);
                let pedestrians = await Pedestrians.getPedestiansInCrosswalk(cw.oid);
                if (pedestrians.length === 0 && carState !== "green") {
                    if (pedestrians.length == 0 && carState != "green") {
                        await Cars.setCarState(car.id, "green");

                        notifications.push({
                            id: car.id, code: "green",
                            message: "No pedestrians near crosswalk " + cw.oid
                        });
                    } else if (carState != "orange" && pedestrians.length > 0) {
                        await Cars.setCarState(car.id, "orange");

                        notifications.push({
                            id: car.id, code: "orange",
                            message: "Pedestrians near the following crosswalk" + cw.oid
                        });
                    }
                }
                for (let cw of crosswalks.closeRange) {
                    await Cars.addCarToCrossWalk(car.id, cw.oid)
                    let pedestrians = await Pedestrians.getPedestiansInCrosswalk(cw.oid);
                    if (pedestrians.length == 0 && carState != "green") {
                        await Cars.setCarState(car.id, "green");
                        notifications.push({
                            id: car.id, code: "green",
                            message: "No pedestrians near near crosswalk " + cw.oid
                        });
                    } else if (carState != "red" && pedestrians.length >= 0) {
                        await Cars.setCarState(car.id, "red");
                        notifications.push({
                            id: car.id, code: "red",
                            message: "Pedestrians near the following crosswalk " + cw.oid
                        });
                        /*for(let ped of pedestrians)
                            notifications.push({id: ped, code: "orange", message: "Careful, car nearby"})*/
                    }
                }
                for (let cw of crosswalks.notInRange) {
                    await Cars.removeCarFromCrossWalk(body.id, cw.oid);
                    let pedestrians = await Pedestrians.getPedestiansInCrosswalk(cw.oid);
                    if (crosswalks.closeRange.length === 0 && crosswalks.longRange.length === 0)
                        for (ped of pedestrians) {
                            if (await Pedestrians.getPedestrianState(ped) != "green") {
                                notifications.push({
                                    id: carId, code: "green",
                                    message: "No pedestrians nearby"
                                })
                                await Pedestrians.setPedestrianState(ped, "green")
                            }
                        }
                }

                let response = JSON.stringify(notifications);
                console.log("Response: " + response)
                ws.send(response);
            }
        } catch(err){
            let response = {
                code: 500,
                err
            };
            console.log(err);
            ws.send(JSON.stringify(response));
        }

    })
});


module.exports = app;