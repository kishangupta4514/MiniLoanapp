const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
        console.log("Token _______________________ ", token);
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.log("Token not valid _______________________ ", token);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
