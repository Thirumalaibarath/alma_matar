const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const PORT = 3000;
const { addStudent,getCalendarDetails } = require('../datastore'); 
const { autoNotification } = require('../Auto_notification');
autoNotification()

const {generateToken,authenticateToken} = require("../token")
const url = "https://auth.delta.nitt.edu/api/oauth/token";
const baseURL = "auth.delta.nitt.edu/authorize";
const params = {
    client_id: "B-N8ma.~1IAIrS5L",
    redirect_uri: "https://alma-matar.vercel.app/redirect",
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
app.use(express.static(path.join(__dirname, '../public')));
app.get('/get-auth-url', (req, res) => {
    res.json({ authUrl: fullURL });
});
const url_new = "https://auth.delta.nitt.edu/api/resources/user";
app.use(bodyParser.json());
app.post('/getname', (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({ message: 'Name and password are required.' });
    }
    console.log(name,password)
});
app.post('/access_token',(req,res)=>{
    const { name } = req.body;
    const userPayload = {name : name};
    const token = generateToken(
        userPayload
    )
    res.json({ token:token });
})
app.get('/calendar_details', authenticateToken, async(req, res) => {
    const { user } = req;
    try {
        const events = await getCalendarDetails(user.name); 
        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.post('/post_deadline', authenticateToken, (req, res) => {
    const { user } = req;
    const { deadline } = req.body;
    res.json({ message: `Deadline set successfully for user: ${user.name}`, deadline });
});
app.get('/redirect', (req, res) => {
    const { code, state } = req.query;
    if (code && state) {
        const bodyParams = {
            client_id: "B-N8ma.~1IAIrS5L",
            client_secret: "2vYHnmqLsKH8772SxGkLKMVEaCcb_.0x",
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "https://alma-matar.vercel.app/redirect"
        }
        const tokenUrl = Object.entries(bodyParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join("&");

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: tokenUrl
        })
        .then(response => response.json())
        .then(data => {
            if (data.id_token && data.access_token) {
                fetch(url_new, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization" : "Bearer " + data.access_token
                    }
            })
            .then((response) => response.json())
            .then((data) => 
                addStudent('students', data.email, {
                    id: data.id,
                    name: data.name,
                    phone_number: data.phoneNumber,
                    gender: data.gender,
                    batch: data.batch
                  })
        )
                const redirectUrl = `http://alma-matar.vercel.app/success?id_token=${data.id_token}`;
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
app.get('/success', (req,res) => {
   res.sendFile(path.join(__dirname, '../public', 'redirect_page.html'));
});

app.post('/get-auth-url', (req, res) => {
    res.json({ authUrl: fullURL });
});
app.get('/terms_and_conditions', (req,res) => {
    const filePath = path.join(__dirname, '../public', 'terms_and_conditions.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.send(data);
        }
    });
});
app.get('/privacy_policy', (req, res) => {
    const filePath = path.join(__dirname, '../public', 'privacy_policy.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.send(data);
        }
    });
});
app.get('/delete_account', (req, res) => {
    const filePath = path.join(__dirname, '../public', 'delete_account_screen.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.send(data);
        }
    });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
