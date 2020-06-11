import DataService from '../services/user.service';
import React, {Component} from 'react';
import MaterialTable from 'material-table';

export default class crosswalks extends Component{

    state = {
        columns: [
            { title: 'ID', field: 'oid' },
            { title: 'Start Latitude', field: 'LatS' },
            { title: 'Start Longitude', field: 'LongS' },
            { title: 'End Latitude', field: 'LatE'},
            { title: 'End Longitude', field: 'LongE'}
        ],
        // Data
        crosswalks: []
    };

    deleteCrosswalk(id) {
        DataService.deleteCrosswalk(id)
            .then(response => {
                console.log(response);
                this.getCrosswalks();
                return true;
            }).catch(err => console.log(err));
    };

    getCrosswalks()  {
        DataService.getCrosswalks()
            .then(response => {
                console.log(response.data);

                this.setState({
                    crosswalks: response.data
                });

            })
            .catch(err => console.log(err));
    };
    componentDidMount() {
        this.getCrosswalks();
    }

    render() {
        return(
            <MaterialTable
                title="Choose Crosswalk to Delete"
                columns={this.state.columns}
                data={this.state.crosswalks}
                actions={[
                    {
                        icon: 'delete',
                        tooltip: "Delete Crosswalk",
                        onClick: (event, data) => {
                            console.log(data);
                            this.deleteCrosswalk(data.oid);
                        }
                    }
                ]}
            />
        )
    }
}
