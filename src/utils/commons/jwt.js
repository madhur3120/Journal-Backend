const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../../config');
const generateToken = (userId) => {
    const JWT_SECRET = ServerConfig.JWT_SECRET
    const token = jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: "7d"
    });
    return token;
}
module.exports = { generateToken }