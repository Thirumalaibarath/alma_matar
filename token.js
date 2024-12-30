const jwt = require('jsonwebtoken');

const SECRET_KEY = "your_secret_key"; 

function generateToken(payload) {
    const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: "1h"
    });
    return token;
}
const userPayload = { userId: 123, email: "user@example.com", role: "admin" };
const token = generateToken(userPayload);
console.log("JWT Token:", token);

module.exports = {
   generateToken
  };
