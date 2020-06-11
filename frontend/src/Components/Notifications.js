import React, {Component} from 'react';
import Notification from 'react-web-notification';

import GreenLight from '../images/traffic-light-green.png';
import RedLight from '../images/traffic-light-red.png';
import OrangeLight from '../images/traffic-light-orange.png';

export default class Notifications extends Component{

    wsNotifications = new WebSocket(`${process.env.REACT_APP_NOTIFICATIONS_WS}`);

    constructor() {
        super();

        this.state = {
            ignore: true,
            title: '',
            message: '',
            code: '',
            options: {}
        };
        this.connect();
    }

    connect() {
        this.wsNotifications.onopen = () => console.log("Connected to Notification Server");
    }

    componentDidMount() {
        this.wsNotifications.onmessage = (message) => {
            let notification = JSON.parse(message.data);

            this.triggerNotification(notification);
        };

        this.wsNotifications.onclose = () => this.connect();
    }


    handlePermissionGranted() {
        console.log("Permission Granted");
        this.setState({
            ignore: false
        });
    }

    handlePermissionDenied() {
        console.log("Permission Denied");
        this.setState({
            ignore: true
        })
    }

    handleNotSupported() {
        console.log("Notifications Not Supported");
        this.setState({
            ignore: true
        })
    }

    handleNotificationOnClose() {
        console.log("Notification closed... Pedestrian crossing the road?");

    }

    triggerNotification(data) {
        console.log("Trying to Notify");
        if(this.state.ignore) {
            return null;
        }
        console.log("Notifying...");
        const title = 'Pedestrian';
        const body = data.message;
        const icon = data.state === 'green' ? GreenLight : ( data.state === 'red' ? RedLight : OrangeLight);

        const options = {
            title: title,
            body: body,
            icon: icon
        };

        this.setState({
            title: title,
            options: options
        })

    }

    render(){
        return (
            <div>
                <Notification
                    ignore={this.state.ignore && this.state.title !== ''}
                    notSupported={this.handleNotSupported.bind(this)}
                    onPermissionGranted={this.handlePermissionGranted.bind(this)}
                    onPermissionDenied={this.handlePermissionDenied.bind(this)}
                    onClose={this.handleNotificationOnClose.bind(this)}
                    timeout={5000}
                    title={this.state.title}
                    options={this.state.options}
                />
            </div>

        )
    }
}