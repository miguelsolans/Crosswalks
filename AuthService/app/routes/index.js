const express = require('express');
const app = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../controllers/users');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth');

/**
 * User Authentication
 * JSON Body: username, password, email, fullName
 */
app.post('/register', checkAuth, (req, res) => {
    console.log("POST / user");
    const userInformation = req.body;

    console.log(userInformation);

    bcrypt.hash(userInformation.password, 10, (err, hash) => {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            const newUser = {
                username: userInformation.username,
                password: hash,
                email: userInformation.email,
                fullname: userInformation.fullName
            };

            User.newUser(newUser)
                .then(data => res.status(201).json(data))
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err)
                });
        }

    });
});

/**
 * User Authentication
 * JSON Body: username, password
 */
app.post('/auth', (req, res) => {
    const loginCredentials = req.body;

    User.findUser(loginCredentials.username)
        .then(user => {
            if(!user){
                res.status(401).jsonp({title: "Error", message: `User ${loginCredentials.username} does not exists`});
            } else {
                bcrypt.compare(loginCredentials.password, user.password)
                    .then(result => {
                        if (!result) {
                            res.status(401).jsonp({title: "error", message: "Invalid password!"});
                        } else {
                            const token = jwt.sign({
                                    username: user.username
                                },
                                process.env.AUTH_SECRET, {expiresIn: process.env.AUTH_TOKEN_TIMETOLIVE},
                                {algorithm: process.env.AUTH_TOKEN_ALGORITHM}
                            );

                            const cookieOptions = {
                                httpOnly: true
                            };

                            res.cookie('userToken', token, cookieOptions);
                            res.status(201).json({
                                title: "Success!", message: "User logged on successfully", token: token, user: {
                                    username: user.username,
                                    fullname: user.fullname
                                }
                            });
                        }


                    })
                    .catch(err => res.status(401).jsonp(err));
            }

        }).catch(err => res.status(500).json(err));

});

app.post('/validation', (req, res) => {

    const token = req.headers.userToken || req.headers.usertoken;

    console.log(req.headers);

    try {
        const decodedToken = jwt.verify(token, process.env.AUTH_SECRET, { algorithm: 'RS256' });
        res.status(200).json({title: "Success", message: "Authentication was successful"});
    } catch(err) {
        res.status(401).json(err);
    }
});

module.exports = app;
