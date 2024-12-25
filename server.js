const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;
const session = require('express-session');

const { addStudent, db } = require('./firebase'); 

const url = "https://auth.delta.nitt.edu/api/oauth/token";
const baseURL = "auth.delta.nitt.edu/authorize";
const params = {
    client_id: "B-N8ma.~1IAIrS5L",
    redirect_uri: "https://alma-matar.onrender.com/redirect",
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

app.use((req, res, next) => {
    console.log("Session Data:", req.session);
    next();
});

app.post('/getname', (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: 'Name and password are required.' });
    }

    console.log(name,password)
});

app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.get('/redirect', (req, res) => {
    const { code, state } = req.query;
    
    if (code && state) {
        const bodyParams = {
            client_id: "B-N8ma.~1IAIrS5L",
            client_secret: "2vYHnmqLsKH8772SxGkLKMVEaCcb_.0x",
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "https://alma-matar.onrender.com/redirect"
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
        .then(data =>{
            if(data.access_token)
            {
                // the user object 
                fetch(url_new, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization" : "Bearer" + data.access_token
                    }
            })
            .then(user =>{
                console.log(user)
            }
            )
            }
        })
        .then(data => {
            if (data.id_token) {
                console.log(data)
                req.session.idToken = data.id_token;
                console.log(data.id_token)
                // res.status(200).json({ id_token: req.session.idToken });
                const redirectUrl = `https://alma-matar.onrender.com/success?id_token=${data.id_token}`;
                res.redirect(redirectUrl);
            } else {
                res.status(503).json({ error: 'ID token not available.' });
            }
        }
    )
        .catch(error => {
            console.error("Error fetching token:", error);
            res.status(500).json({ error: 'Failed to fetch token.' });
        });

    } else {
        res.status(400).send('Missing authorization code or state');
    }
});

app.post('/get-auth-url', (req, res) => {
    res.json({ authUrl: fullURL });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});