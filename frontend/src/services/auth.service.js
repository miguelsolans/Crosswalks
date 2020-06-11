/**
 * Auth Service: Authentication Service
 */
import axios from 'axios';
import Cookies from 'js-cookie';

class AuthService {
    login({username, password}) {
        return axios.post(`${process.env.REACT_APP_API_URL}/user/auth`, {
            username: username,
            password: password
        }).then(response => {
            if(response.data.token) {
                Cookies.set('userToken', response.data.token, {
                    expires: 1,
                });
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        })
    }

    logout() {
        Cookies.remove('userToken');
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'))
    }
}

export default new AuthService();