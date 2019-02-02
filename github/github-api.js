const octokit = require('@octokit/rest');
const axios = require('axios')


class GithubApi {
    constructor() {

        this.users = {};
    }

    async  setToken(token) {
        const res = await this.getUserDetails(token.access_token)
        this.users[token.access_token] = { token, ...res }
    }
    async  isValidate(token) {
        return new Promise(async (resolve, reject) => {
            for (var i = 0; i < 3; i++) {
                const res = await this.checkToken(token);
                if (res) {
                    return resolve(res);
                }
            }
            return resolve(false)
        })
    }
    async checkToken(token) {
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                if (this.users[token]) {
                    return resolve(this.users[token])
                }
                return resolve(false)
            }, 200);


        });
    }

    async  getUserDetails(token) {
        try {
            let obj = new octokit();
            obj.authenticate({
                type: 'app',
                token
            })
         //   const repos = await obj.repos.getAll();
            const userDetails = await axios.get(`https://api.github.com/user?access_token=${token}`)
            const { name, login, avatar_url } = userDetails.data;
            //     console.log(repos);
            //  const specificRepo = await obj.repos.get({ owner: repos.data[0].owner.login, repo: repos.data[0].name });
            //    console.log(specificRepo);
            return (
                {
                    userDetails: { name, login, avatar_url },
                   // repos: repos.data.map(r => r.full_name)
                })
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new GithubApi();