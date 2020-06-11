// import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import React, { Component } from 'react'
import L from 'leaflet';
import '../App.css'
import DataService from '../services/user.service';

export default class MyMap extends Component {

    wsCar = new WebSocket(`${process.env.REACT_APP_CARS_WS}`);
    wsPedestrian = new WebSocket(`${process.env.REACT_APP_PEDESTRIANS_WS}`);

    state = {
        // Leaflet Configuration
        pedestrianIcon: L.icon({
            iconUrl: require('../images/current.png'),
            iconSize: [40, 40],
        }),
        carIcon: L.icon({
            iconUrl: require('../images/car.png'),
            iconSize: [40, 40],
        }),
        crosswalkIcon: L.icon({
            iconUrl: require('../images/crosswalk.png'),
            iconSize: [40, 40],
        }),
        map: null,


        cars: [{
            id: 0,
            latitude: 0,
            longitude: 0
        }],
        crosswalks: [],
        initLat:  41.56042633772714,
        initLong:  -8.406037688255308,
        zoom: 25,

        markers: {},
    };

    handleMarker(coordinates, icon) {
        if(coordinates.action && coordinates.action === "close"){
            console.log("deleting " + coordinates.id + " icon " + icon);

            this.state.map.removeLayer(this.state.markers[coordinates.id]);
            delete this.state.markers[coordinates.id];

            console.log(this.state.markers);
            return;
        }
        if(this.state.markers[coordinates.id] !== undefined) {
            this.state.markers[coordinates.id].setLatLng({
                lat: coordinates.latitude,
                lng: coordinates.longitude
            });

        } else {
            this.state.markers[coordinates.id] = new L.marker( [coordinates.latitude, coordinates.longitude], {
                id: coordinates.id,
                icon: icon
            }).addTo(this.state.map);
        }
    }

    connect(websocket) {
        websocket.onopen = () => console.log("Connected");
    }

    markerInfo() {
        if(this.getTooltip() === undefined) {
            const id = this.options.id;
            console.log(this);
            console.group(`Crosswalk ${id} Clicked`);
            const coordinates = {
                latitude: this.getLatLng().lat,
                longitude: this.getLatLng().lng
            };

            console.group("Fetch API");
            DataService.fetchRoad(coordinates)
                .then(response => {

                    console.log(response.data);

                    let fetchedInfo = response.data.results[0];

                    const tooltip = `${fetchedInfo.annotations.flag} <b>${fetchedInfo.components.county}</b>
                                    <br/>${fetchedInfo.components.suburb}, ${fetchedInfo.components.road}
                                    <br/><br/>Latitude: ${fetchedInfo.annotations.DMS.lat}<br/>Latitude: ${fetchedInfo.annotations.DMS.lng}`;
                    this.bindTooltip(tooltip).openTooltip();


                }).catch(err => {
                console.log(err);
            });

            console.groupEnd();
        }

    }

    componentDidMount() {
        // Init Component
        let newMap = L.map('map', {
            center: [this.state.initLat, this.state.initLong],
            zoom: this.state.zoom,
            layers: [
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }),
            ]
        });
        this.setState({
            map: newMap,
        });


        // Load Data
        DataService.getCrosswalks()
            .then(response => {
                console.log(response.data);

                response.data.forEach(crosswalk => {

                    this.state.markers[crosswalk.oid] = new L.marker([crosswalk.LatS, crosswalk.LongS], {
                        id: crosswalk.oid,
                        icon: this.state.crosswalkIcon
                    }).on('click', this.markerInfo).addTo(this.state.map)
                });

          }).catch(err => console.log(err));

        // Bi-directional Communication: Cars
        this.wsCar.onopen = (message) => {
            console.group("Car Connected");
            console.log(message);
            console.groupEnd();
        };
        /**
       * Listen to data sent from the WebSocket Server
       * @param message
       */
        this.wsCar.onmessage = (message) => {
            const coordinates = JSON.parse(message.data);

            this.state.cars.push(coordinates);

            this.handleMarker(coordinates, this.state.carIcon);
        };

        /**
        * Socket Close
        */
        this.wsCar.onclose = () => this.connect(this.wsCar);

        // Bi-directional Communication: Pedestrian
        this.wsPedestrian.onopen = (message) => {
            console.group("Pedestrian Connected");
            console.log(message);
            console.groupEnd();
        };
        this.wsPedestrian.onmessage = (message) => {
            const coordinates = JSON.parse(message.data);
            //console.group("Pedestrian Update");
            //console.log(message);

            this.handleMarker(coordinates, this.state.pedestrianIcon);

            console.log("Updated!");
            console.groupEnd();
        };
        this.wsPedestrian.onclose = () => this.connect(this.wsPedestrian);
    }
    render() {
        return (
            <div>
                <div id="map"></div>
            </div>
        )
    }
}