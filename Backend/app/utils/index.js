module.exports.getHeaderWithUserToken = (req) => {
    return { headers: {
            userToken: req.headers.usertoken || req.headers.userToken
        }}
};