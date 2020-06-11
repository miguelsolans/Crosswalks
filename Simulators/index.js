const Car = require('./car')
const Pedestrian = require('./pedestrians')

function run1(){
    let pointsCarA =  [{latitude: 41.560939585919584, longitude: -8.404479384422299}, {
        latitude: 41.56011525503568, longitude: -8.406928181648254}]
    const carA = new Car(pointsCarA, 5, 10);

    let pointsPedA = [{latitude: 41.560348065448984, longitude: -8.406000137329102}, {
        latitude: 41.56076451301872, longitude: -8.4060537815094}]
    const PedestrianA = new Pedestrian(pointsPedA, 1, 2);

    carA.run()
    PedestrianA.run()
}

function run2(){
    let pointsCarA =  [{latitude: 41.560590373181626, longitude: -8.405562996864315}, {
        latitude: 41.56011525503568, longitude: -8.406928181648254}]
    const carA = new Car(pointsCarA, 5, 10);

    let pointsPedA = [{latitude: 41.560348065448984, longitude: -8.406000137329102}, {
        latitude: 41.56076451301872, longitude: -8.4060537815094}]
    const PedestrianA = new Pedestrian(pointsPedA, 1, 2);

    carA.run()
    PedestrianA.run()
}

function run3() {
    let pointsCarA =  [{latitude: 41.560590373181626, longitude: -8.405562996864315}, {
        latitude: 41.56011525503568, longitude: -8.406928181648254}]
    const carA = new Car(pointsCarA, 5, 7);

    let pointsPedA = [{latitude: 41.560348065448984, longitude: -8.406000137329102}, {
        latitude: 41.56105197582463, longitude: -8.406544685363766}]
    const PedestrianA = new Pedestrian(pointsPedA, 1, 2);

    carA.run()
    PedestrianA.run()
}

function run4() {
    let pointsCarA =  [{latitude: 41.560590373181626, longitude: -8.405562996864315}, {
        latitude: 41.56011525503568, longitude: -8.406928181648254}]
    const carA = new Car(pointsCarA, 5, 7);

    let pointsPedA = [{latitude: 41.560348065448984, longitude: -8.406000137329102}, {
        latitude: 41.56105197582463, longitude: -8.406544685363766}]
    const PedestrianA = new Pedestrian(pointsPedA, 1, 2);

    carA.run()
    PedestrianA.run()
}


//RUN 4 isn't done yet
let simulations = [run1, run2, run3, run4]
if(!process.argv[2]){
    console.log("type the run you want, 1-4")
} else {
    let i = parseInt(process.argv[2])
    if(i && i >= 1 && i <= 4)
        simulations[i]()
    else console.log("Invalid index: " + i)
}
run3()


