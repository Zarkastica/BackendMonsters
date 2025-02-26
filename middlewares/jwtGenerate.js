const jwt = require('jsonwebtoken');

const generateToken = (userData = {}) => {
    try {
        const secret = process.env.SECRET_KEY;
        const payload = {userData};
        const token = jwt.sign(payload,secret,{
            expiresIn: '2h'
        });
        return token;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    generateToken
}