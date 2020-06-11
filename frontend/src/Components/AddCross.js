import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import DataService from '../services/user.service';

class AddCross extends Component {
    constructor() 
    {
        super();
        
        this.state = {
          LatS:'',
          LongS:'',
          LatE:'',
          LongE:'',
          redirect: false
        };

        this.onChangeLatS = this.onChangeLatS.bind(this);
        this.onChangeLatE = this.onChangeLatE.bind(this);
        this.onChangeLongS = this.onChangeLongS.bind(this);
        this.onChangeLongE = this.onChangeLongE.bind(this);
    }

    onChangeLatS(e) {
        this.setState({
            LatS: e.target.value
        });
    }

    onChangeLatE(e) {
        this.setState({
            LatE: e.target.value
        });
    }

    onChangeLongS(e) {
        this.setState({
            LongS: e.target.value
        });
    }

    onChangeLongE(e) {
        this.setState({
            LongE: e.target.value
        });
    }

    handleOnSubmit = (e) => {
        e.preventDefault();
        const data = {
            startLatitude: this.state.LatS,
            startLongitude: this.state.LongS,
            endLatitude: this.state.LatE,
            endLongitude: this.state.LongE
        };
        DataService.newCrosswalk(data)
            .then(response => {
                console.log(response);
                this.setState({
                    redirect: true
                })
            }).catch(reason => console.log(reason));
    };

    render() 
    {
        const {redirect} = this.state;
        if(redirect){
            return <Redirect to="/Cross"/>
        }else {
            return (
                <div className="w3-row" >
                    <div className="w3-quarter " > <br/></div>
                    <div className="w3-half w3-margin w3-card w3-white">
                        <form className="w3-padding w3-card"  onSubmit={this.handleOnSubmit} >
                            <h2 className="w3-center">Nova Passadeira</h2>
                            <br/>
                            <label>Inicio da Passadeira</label>
                            <input className="w3-input w3-round-large"
                                type="text"
                                value={this.state.LatS}
                                name="Number"
                                placeholder="Latitude inicial"
                                onChange={this.onChangeLatS}
                            />
                            <input className="w3-input w3-round-large"
                                type="text"
                                value={this.state.LongS}
                                name="Number"
                                placeholder="Longitude inicial"
                                onChange={this.onChangeLongS}
                            />
                            <label>Fim da Passadeira</label>
                            <input className="w3-input w3-round-large"
                                type="text"
                                value={this.state.LatE}
                                name="Number"
                                placeholder="Latitude final"
                                onChange={this.onChangeLatE}
                            />
                            <input className="w3-input w3-round-large"
                                type="text"
                                value={this.state.LongE}
                                name="Number"
                                placeholder="Longitude final"
                                onChange={this.onChangeLongE}
                            /> 
                            <br/>
                            <button onClick={this.handleOnSubmit} className="w3-button w3-white w3-border w3-border-grey w3-round-large w3-hover-light-grey">Adicionar Passadeira</button>
                        </form>
                    </div>
                    <div className="w3-quarter"/>
                </div>
            )
            }
        }
}

export default AddCross;