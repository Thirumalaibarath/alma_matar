const jwt = require('jsonwebtoken');

// Secret key (keep it secure and never expose it publicly)
const SECRET_KEY = "your_secret_key"; 

// Generate token
function generateToken(payload) {
    // `payload` contains the user information (claims)
    const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: "1h" // Token expires in 1 hour
    });
    return token;
}

// Example usage
const userPayload = { userId: 123, email: "user@example.com", role: "admin" };
const token = generateToken(userPayload);
console.log("JWT Token:", token);
