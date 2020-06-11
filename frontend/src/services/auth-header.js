/**
 * Authentication Header
 * Retrieves Authorization Header Json Web Token
 */
import Cookies from 'js-cookie';

export default function authHeader() {
    const token = Cookies.get('userToken');

    console.log("TOKEN: " + token);
    if(token) {
        return { 'userToken': token }
    } else {
        return { }
    }
}