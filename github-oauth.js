const githubOAuth = require('github-oauth')
const {addSession} = require('./data')
const querystring =require('querystring');
const githubApi = require('./github/github-api')
class GithubAuth {
    constructor() {
    this.auth=  githubOAuth(({
            githubClient: process.env['GITHUB_CLIENT'] || '83c0f0c94c5bc6c74721',
            githubSecret: process.env['GITHUB_SECRET'] || '800e7c20f00a53aafddfa6acfcd5db2edefa42c7',
            baseURL: 'http://localhost:3000',
            loginURI: '/api/github',
            callbackURI: '/api/github/callback',
            scope: 'user' // optional, default scope is set to user
        }))



        this.auth.on('error', (err) => {
            console.error('there was a login error', err)
        })

        this.auth.on('token', (token, res) => {
            console.log('here is your shiny new github oauth token', token)
            const session = {token}
            addSession(token, session);
            githubApi.setToken(token);
            const query = querystring.stringify({
              ...token
            });
            res.redirect('/login/?' + query);
            //res.json(session);
         //   serverResponse.end(JSON.stringify(token))
        })
    }

    login(req, res) {

        return this.auth.login(req, res)
       
    }

    callback(req, res) {
        this.auth.callback(req, res);
    }
}




module.exports = new GithubAuth();