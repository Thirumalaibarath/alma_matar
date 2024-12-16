const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;
const punycode = require('punycode');
const session = require('express-session');

let global = { idToken: null };

const url = "https://auth.delta.nitt.edu/api/oauth/token";
var tokenUrl = "";
const baseURL = "auth.delta.nitt.edu/authorize";
const params = {
    client_id: "B-N8ma.~1IAIrS5L",
    redirect_uri: "http://10.0.2.2:3000/redirect",
    response_type: "code",
    grant_type: "authorization_code",
    state: "code",
    scope: "email+openid+profile+user",
    nonce: ""
};

const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

const fullURL = `${baseURL}?${queryString}`;
app.use(express.static('public'));
app.get('/get-auth-url', (req, res) => {
    res.json({ authUrl: fullURL });
});

const url_new = "https://auth.delta.nitt.edu/api/resources/user";

app.use(bodyParser.json());

app.post('/getname', (req, res) => {
    const { name, password } = req.body;

    // Check if 'name' and 'password' are present
    if (!name || !password) {
        return res.status(400).json({ message: 'Name and password are required.' });
    }

    console.log(name,password)
});

app.use(session({
    secret: 'your_secret_key',  // A secret key for signing the session ID
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true if using HTTPS
}));

app.get('/redirect', (req, res) => {
    const { code, state } = req.query;
    
    if (code && state) {
        const bodyParams = {
            client_id: "B-N8ma.~1IAIrS5L",
            client_secret: "2vYHnmqLsKH8772SxGkLKMVEaCcb_.0x",
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "http://10.0.2.2:3000/redirect"
        };

        const tokenUrl = Object.entries(bodyParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join("&");

        // Fetch the token
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: tokenUrl
        })
        .then(response => response.json())
        .then(data => {
            if (data.id_token) {
                // Store the token in the session for this specific user
                req.session.idToken = data.id_token;
                console.log(data.id_token)

                res.status(200).json({ id_token: req.session.idToken });
                
            } else {
                res.status(503).json({ error: 'ID token not available.' });
            }
        })
        .catch(error => {
            console.error("Error fetching token:", error);
            res.status(500).json({ error: 'Failed to fetch token.' });
        });

    } else {
        res.status(400).send('Missing authorization code or state');
    }
});

// app.post('/get-id-token', (req, res) => {
//     if (global.idToken) {
//         res.status(200).json({ id_token: global.idToken });
//     } else {
//         res.status(500).json({ error: "ID token not set yet" });
//     }
// });
app.post('/get-auth-url', (req, res) => {
    res.json({ authUrl: fullURL });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});