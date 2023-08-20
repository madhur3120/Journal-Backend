const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../config');
const { UserRepository } = require('../repositories')

const userRepository = new UserRepository();

const isAuthenticated = async (req, res, next) => {
    const authHeader = await req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Authorization header missing or malformed" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded_token = jwt.verify(token, ServerConfig.JWT_SECRET);
        req.user = await userRepository.getById(decoded_token.id);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = isAuthenticated;
