const User = require('../models/user');

module.exports.findUser = (username, password) => {
    //return User.findOne({ username: username })
    return User.findOne({ username: username });
};

module.exports.newUser = ({username, password, email, fullname}) => {
    const newUser = new User({
        username: username,
        password: password,
        email: email,
        fullname: fullname
    });

    return newUser.save();
};