import DataService from '../services/user.service';
import React, {Component} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 620
    }
});

export default class crosswalks extends Component{
    // classes = useStyles();

    state = {
        crosswalks: []
    };

    fetchInfo(data) {
        const coordinates = {
            latitude: data.LatS,
            longitude: data.LongS
        };
        console.log(coordinates);
        DataService.fetchRoad(coordinates)
            .then(response => {
                let results = response.data.results[0];

                let newCrosswalk = {
                    oid: data.oid,
                    LatS: results.annotations.DMS.lat,
                    LongS: results.annotations.DMS.lng,
                    address: results.formatted,
                    state: data.state
                };

                this.setState({
                    crosswalks: [ ...this.state.crosswalks, newCrosswalk ]
                });


            }).catch(err => console.log(err));
    }

    componentDidMount() {
        DataService.getCrosswalks()
            .then(response => {
                console.log(response.data);

                response.data.forEach(entry => this.fetchInfo(entry));

                console.log("Data fetched");

            })
            .catch(err => console.log(err));
    }

    render() {
        return(
            <TableContainer component={Paper}>
                <Table className={useStyles.table} aria-label="Available Crosswalks">
                    <TableHead>
                        <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell>Latitude</TableCell>
                            <TableCell>Longitude</TableCell>
                            <TableCell>State</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { this.state.crosswalks.map(crosswalk => (
                            <TableRow key={crosswalk.oid}>
                                <TableCell>{crosswalk.address}</TableCell>
                                <TableCell>{crosswalk.LatS}</TableCell>
                                <TableCell>{crosswalk.LongS}</TableCell>
                                <TableCell>{crosswalk.state}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}
