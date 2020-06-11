import React, {Component} from 'react';
import AuthService from '../services/auth.service';
import { Redirect} from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';


export default class Login extends Component{


    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            username: "",
            password: "",
            loading: false,
            message: "",
            redirect: false,
            error: false
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

    /* Chamar função de login no handle submit */
    handleLogin = (e) =>
    {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        AuthService.login(this.state)
            .then( result => {
                console.log(result);
                this.setState({
                    redirect:true
                });
                window.location.reload();
            }).catch(err => {
                console.log(err);
                this.setState({
                    message: err,
                    loading: false,
                    error: true
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
                <div className="w3-row" >
                    <br/>
                    <div className="w3-quarter" > <br/></div>
                        <div className="w3-half w3-center w3-white">
                        <form className="w3-padding w3-card"  onSubmit={this.handleLogin} >
                                <h1 className="w3-center">Login</h1>
                                { this.state.error && (
                                    <div className="alert">
                                        <Alert severity="error">
                                            <AlertTitle>Invalid Username or Password</AlertTitle>
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

                                <input className="w3-input w3-round-large"
                                    type="password"
                                    value={this.state.password}
                                    name="pass"
                                    placeholder="Password"
                                    onChange={this.onChangePassword}/>
                                <br/>
                                <button onClick={this.handleLogin} className="w3-button w3-white w3-border w3-border-grey w3-round-large w3-hover-light-grey">Login</button>
                            </form>
                            
                        </div>
                </div>
            )
        }
    }
}
