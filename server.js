require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const clientId = process.env.CLIENT_ID || '';
const clientSecret = process.env.CLIENT_SECRET || '';
const redirectUri = process.env.REDIRECT_URI || '';

app.use(express.static('build'))

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.get('/client', (req, res) => {
  res.send({client_id: clientId});
});

app.get('/auth', (req, res) => {
  res.redirect(`https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=chat:read%20chat:edit`);
});

app.post('/login/:code', (req, res) => {
  axios.post(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&code=${req.params.code}&grant_type=authorization_code&redirect_uri=${redirectUri}&scope=chat:read%20chat:edit`)
    .then(response=>{
      res.send(response.data);
    })
});

app.listen(port, () => console.log(`Running on port ${port}`));