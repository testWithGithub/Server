const express = require('express');
const { addSession, getTasks, getTask } =  require('./data');
const  githubAuth = require("./github-oauth");
const router = express.Router();
const axios =require('axios')
const qs = require('querystring');
const url = require('url');
const randomString = require('randomstring');
const githubApi = require('./github/github-api');

const redirect_uri = 'http://localhost:3000' + '/api/github/callback';
router.post('/sessions', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email === 'error') {
    res.statusMessage = 'Invalid email or password';
    res.status(401).end();
  } else {
    const name = email.split('@')[0].replace(/\.|_/, ' '); // simulated
    const now = new Date();
    const token = `token-${now.getTime()}`; // simulated
    const session = { email, name, token };
    addSession(token, session);
    res.json(session);
  }
});


router.get('/github', (req, res) => {

 let data =githubAuth.login(req,res)
 console.log(data);
 
})

router.get('/github/callback', (req, res) => {
  return githubAuth.callback(req,res)
})
router.post('/github/validate',async  (req, res) => {
  const { token } = req.body;
 const result = await githubApi.isValidate(token)
  if(!result){
    res.status(404).end();
    } else {
      res.json(result);
    }
})

router.get('/login', (req, res) => {
  let csrf_string = randomString.generate();
  res.setHeader("Content-Type", "text/html")
  const githubAuthUrl =
    'https://github.com/login/oauth/authorize?' +
    qs.stringify({
      client_id: '83c0f0c94c5bc6c74721',
      redirect_uri: redirect_uri,
      state: csrf_string,
      scope: 'user:email'
    });
  res.redirect(githubAuthUrl);
});


router.delete('/sessions/*', (req, res) => {
  res.json(undefined);
});

module.exports = router;
