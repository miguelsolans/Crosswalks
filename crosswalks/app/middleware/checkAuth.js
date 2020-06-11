const axios = require('axios');

module.exports = (req, res, next) => {
    console.log("HEADERS: " + req.headers)
    const token = req.headers.userToken || req.headers.usertoken;

    axios.post(`${process.env.AUTH_SERVICE}/validation`, null, {
        headers: {
            userToken: token
        }
    }).then(response => {
        next();
    }).catch(err => {
        console.log(err.response);
        res.status(500).jsonp(err.response);
    });
};
