import React, {Component} from 'react'

import {
    AppBar,
    Toolbar,
    Typography,
    Menu,
    MenuItem
} from '@material-ui/core';


import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import { RiLoginBoxLine, RiLogoutBoxRLine } from "react-icons/ri"

export default class Navbar extends Component{
    constructor(props) {
        super(props);

        this.state = {
            showAdminBoard: false,
            currentUser: undefined,
            anchorEl: null,
            setAnchorEl: null
        }
    }

    componentDidMount() {
        console.log(this.props);
    }
    handleClick(event) {
        this.state.setAnchorEl = event.currentTarget;
    };

    handleClose() {
        this.state.setAnchorEl = null;
    };


    render() {

        return (
            <AppBar position="static" style={{ backgroundColor: '#696969'}}>
                <Toolbar>
                    <Typography type="title" color="inherit">Crosswalks</Typography>
                    <Link className="text-dec" to="/map" styles="flexGrow:1" >
                        <Button color="inherit">Map</Button>
                    </Link>
                    <Link className="text-dec" to='/crosswalks'>
                        <Button color="inherit">View Crosswalks</Button>
                    </Link>
                    
                    { this.props.showAdminBoard && (
                            <div class="w3-dropdown-hover">
                                <Button color="inherit" backgroundColor="#696969">Manage Crosswalk</Button>
                            <div class="w3-dropdown-content w3-bar-block w3-card-4">
                                <Link className="text-dec" to='/AddCross'>
                                    <Button color="inherit">Add Crosswalk</Button>
                                </Link>
                                <Link className="text-dec" to='/managecross'>
                                    <Button color="inherit">Manage Crosswalk</Button>
                                </Link>
                             </div>
                             <Link className="text-dec" to='/user'>
                                <Button color="inherit">Add Users</Button>
                            </Link>
                            </div>

                            

                    )}

                    <div style={{ flex: 1}}></div>
                    { this.props.currentUser ? (
                        <Link className="text-dec" to='/logout'>
                            <Button color="inherit"><RiLogoutBoxRLine/> Logout</Button>
                        </Link>
                    ) : (
                        <Link className="text-dec" to='/login'>
                            <Button color="inherit"><RiLoginBoxLine/> Login</Button>
                        </Link>
                    )}
                </Toolbar>
            </AppBar>
        )
    }
}