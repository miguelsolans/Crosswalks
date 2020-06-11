import React, {Component} from 'react';
import AuthService from '../services/auth.service';
import { Redirect} from 'react-router-dom';

export default class Login extends Component{

    constructor(props) {
        super(props);
        
        this.state = {
            redirect:false
        };
    }

    componentDidMount(){
        this.setState({ redirect: true });
        AuthService.logout();
        window.location.reload();
    }

    render(){
        const {redirect} = this.state;
        if(redirect){
            return <Redirect to="/Login"/>
        }
        else{
            return <Redirect to="/map"/>
        }
    }
}