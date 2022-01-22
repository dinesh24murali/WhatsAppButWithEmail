const jwt = require("jsonwebtoken");

const Response = require('./Response')

const config = process.env;

const verifyRequest = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send(new Response(false, "A token is required for authentication"));
    }
    try {
        const decoded = jwt.verify(token, config.SECRET_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send(new Response(false, "Invalid Token"));
    }
    next();
};

module.exports = verifyRequest;

