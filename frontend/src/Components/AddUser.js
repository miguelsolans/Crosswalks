import React, {Component} from 'react';
import UserService from '../services/user.service';
import { Redirect } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';

export default class AddUser extends Component{


    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeFullName = this.onChangeFullName.bind(this);

        // JSON Body: username, password, email, fullName
        this.state = {
            error: false,
            success: false,
            message: "",

            username: "",
            password: "",
            email: "",
            fullName: ""
        };
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        })
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    onChangeFullName(e) {
        this.setState({
            fullName: e.target.value
        })
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        })
    }

    /* Chamar função de login no handle submit */
    handleSubmit = (e) =>
    {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        UserService.register(this.state)
            .then( response => {
                console.log(response);
                this.setState({
                    message: "New user created successfully",
                    error: false,
                    success: true,

                    username: "",
                    password: "",
                    email: "",
                    fullName: ""
                });
            }).catch(err => {
                console.log(err);
                this.setState({
                    message: "Impossible to create a new user",
                    loading: false,
                    error: true,
                    success: false
            });
        })

    };

    render() {
        const {redirect} = this.state;
        if(redirect){
            return <Redirect to="/map"/>
        }
        else {
            return(
                <div className="w3-row">
                    <br/>
                    <div className="w3-quarter"><br/></div>
                    <div className="w3-half w3-center w3-white">
                        <form className="w3-padding w3-card"  onSubmit={this.handleLogin} >
                            <h1 className="w3-center">New User</h1>
                            { this.state.error && (
                                <div className="alert">
                                    <Alert severity="error">
                                        <AlertTitle>{this.state.message}</AlertTitle>
                                    </Alert>
                                </div>
                            )}
                            { this.state.success && (
                                <div className="alert">
                                    <Alert severity="success">
                                        <AlertTitle>{this.state.message}</AlertTitle>
                                    </Alert>
                                </div>
                            )}
                            <br/>
                            <input className="w3-input w3-round-large"
                                   type="text"
                                   value={this.state.username}
                                   name="name"
                                   placeholder="Nome de utilizador"
                                   onChange={this.onChangeUsername}/>
                            <br/>
                            <input className="w3-input w3-round-large"
                                   type="text"
                                   value={this.state.fullName}
                                   name="fullname"
                                   placeholder="Full Name"
                                   onChange={this.onChangeFullName}/>
                            <br/>

                            <input className="w3-input w3-round-large"
                                   type="text"
                                   value={this.state.email}
                                   name="email"
                                   placeholder="E-mail"
                                   onChange={this.onChangeEmail}/>
                            <br/>

                            <input className="w3-input w3-round-large"
                                   type="password"
                                   value={this.state.password}
                                   name="pass"
                                   placeholder="Password"
                                   onChange={this.onChangePassword}/>
                            <br/>

                            <button onClick={this.handleSubmit} className="w3-button w3-white w3-border w3-border-grey w3-round-large w3-hover-light-grey">Login</button>
                        </form>

                    </div>
                </div>
            )
        }
    }
}
