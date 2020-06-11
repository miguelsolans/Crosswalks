import React,{Component} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Map from './Components/Map'
import Navbar from './Components/Navbar';

import AddCross from './Components/AddCross'
import Cross from './Components/crosswalk'
import Login from './Components/Login'
import Logout from './Components/Logout'
import ManageCross from './Components/ManageCross'
import AddUser from './Components/AddUser'

import AuthService from './services/auth.service';
import Notifications from './Components/Notifications';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showAdminBoard: false,
            currentUser: undefined,
            items: [],
        }
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();
        if (user) {
            this.setState({
                showAdminBoard: true,
                currentUser: user,
            })
        }
    }

    logout () {
        AuthService.logout();
    }


    render () {
        const { showAdminBoard, currentUser} = this.state;

        return (
            <Router>
                <Notifications/>

                <Navbar showAdminBoard={this.state.showAdminBoard} currentUser={this.state.currentUser}/>
                <Switch>
                    <Route exact path="/map">
                        <Map/>
                    </Route>
                    <Route path="/AddCross">
                        <AddCross/>
                    </Route>
                    <Route path="/login">
                        <Login/>
                    </Route>
                    <Route path="/logout">
                        <Logout/>
                    </Route>
                    <Route path="/crosswalks">
                        <Cross/>
                    </Route>
                    <Route path="/user">
                        <AddUser/>
                    </Route>
                    <Route path="/managecross">
                        <ManageCross/>
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
