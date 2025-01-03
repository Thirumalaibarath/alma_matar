const jwt = require('jsonwebtoken');

const SECRET_KEY = "your_secret_key"; 

function generateToken(payload) {
    const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: "1h"
    });
    return token;
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
module.exports = {
   authenticateToken,
   generateToken
  };
