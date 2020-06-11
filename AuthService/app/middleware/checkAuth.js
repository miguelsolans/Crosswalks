const jwt = require('jsonwebtoken');
const Users = require('../controllers/users');

module.exports = (req, res, next) => {

    try {
        const token = req.headers.usertoken || req.headers.userToken;
	
        const decodedToken = jwt.verify(token, process.env.AUTH_SECRET, { algorithm: process.env.AUTH_TOKEN_ALGORITHM });
	
        console.log(`Decoded Token ${decodedToken.username}`);

        Users.findUser(decodedToken.username)
            .then(user => {
                if(!user){
                    res.jsonp( {title: "Error!", message: "Invalid credentials"} );
                } else {
                    req.decodedUser = {
                        username: user.username,
                        fullName: user.fullName,
                        email: user.email
                    };

                    console.log(`${req.decodedUser.username} logged on`);

                    next();
                }
            })
            .catch(err => res.status(401).jsonp(err));

    } catch(err) {
        res.status(401).jsonp( { title: "Error!", message: "Authentication failed!", error: err} );
    }
};