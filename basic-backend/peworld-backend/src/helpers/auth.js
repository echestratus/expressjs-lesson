const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    const verifyOption = {
        expiresIn: '2h',
        issuer: 'Farhan Nur Hakim'
    }
    return jwt.sign({
        data: payload
      }, process.env.SECRET_KEY, verifyOption);
}

const generateRefreshToken = (payload) => {
    const verifyOption = {
        expiresIn: '24h',
        issuer: 'Farhan Nur Hakim'
    }
    return jwt.sign({
        data: payload
      }, process.env.SECRET_KEY, verifyOption);
}

module.exports = {
    generateToken,
    generateRefreshToken
}