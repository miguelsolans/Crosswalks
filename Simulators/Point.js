class Point {
    /**
     * Creates a poing in map
     * @param latitude: latitude raging from
     * @param longitude: longitude raging from
     */
    constructor(id, latitude, longitude, isCar) {
        this.id = id;
        this.longitude = longitude;
        this.latitude = latitude;
        this.car = isCar;
    }


    degreesToRadians() {
        return this.latitude * Math.PI / 180;
    }

    override() {
        console.log(`Latitude=${this.latitude}\nLongitude=${this.longitude}`);
    }

    isCar(){
        return this.car;
    }

    isPedestrian(){
        return !this.car;
    }
}


module.exports = Point;