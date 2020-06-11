/**
 * User Service: Access Backend Server Data
 */
import axios from 'axios';
import authHeader from './auth-header';

class UserService {

    /**
     * Get list of Crosswalks
     * @returns {Promise<AxiosResponse<T>>}
     */
    getCrosswalks() {
        return axios.get(`${process.env.REACT_APP_API_URL}/crosswalk`)
    }

    newCrosswalk({ startLatitude, startLongitude, endLatitude, endLongitude}) {
        return axios.post(`${process.env.REACT_APP_API_URL}/crosswalk`, {
            startLatitude: startLatitude,
            startLongitude: startLongitude,
            endLatitude: endLatitude,
            endLongitude: endLongitude
        }, {
            headers: authHeader()
        });
    }

    deleteCrosswalk(id) {
        return axios.delete(`${process.env.REACT_APP_API_URL}/crosswalk/${id}`, {
            headers: authHeader()
        });
    }

    /**
     * Get road information based on given coordinates
     * @param latitude
     * @param longitude
     * @returns {Promise<AxiosResponse<T>>}
     */
    fetchRoad({ latitude, longitude }) {
        return axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C${longitude}&key=${process.env.REACT_APP_OPENCAGE_KEY}&pretty=1`);
    }

    register({username, password, email, fullName}) {
        return axios.post(`${process.env.REACT_APP_API_URL}/user/register`, {
            username: username,
            password: password,
            email: email,
            fullName: fullName
        }, {
            headers: authHeader()
        });
    }

}

export default new UserService();