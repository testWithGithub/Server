const graphql = require('@octokit/graphql');
const Octokit = require('@octokit/rest');
const axios = require('axios');
const { request, GraphQLClient } = require('graphql-request');
//https://api.github.com/graphql
const token = '052645882dea5cdb43d767e254e20cc591679e20'


const getRopesByUser = async (owner = "maty21", repo = "test") => {
  try {
   // const result = await octokit.repos.get({ owner, repo })
    const result = await octokit.issues.listForRepo({owner, repo,per_page:100})
    console.log(result)
    
  } catch (error) {
    console.log(error)
    
  }
}
const query = async (atoken) => {
  const data= await graphql(`{ repository(owner:"maty21" name:"test"){
        issues(last:100){
        edges{
          node{
            id,
            number,
            title,
            bodyText,
            bodyHTML
            labels(last:10) {
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      }  
      
    }
    }`, {
      headers: {
        authorization: `token ${atoken}`
      }
    })
  return data
}
const octokit = new Octokit({
  auth: token
})

// octokit.authenticate({
//   type: 'oauth',
//   token
// })


const commentMutation = async (id, version, result) => {
  const { data } = await graphql(`mutation {
    addComment(input:{clientMutationId: "2", subjectId:"${id}" , body: "#### version:\n ${version}\n  #### result:\n  ${result}"\n}) {
      clientMutationId
      commentEdge {
        node {
          body
          repository {
            id
            name
            nameWithOwner
          }
          issue {
            number
          }
        }
      }
    }
  }`, {
      headers: {
        authorization: `token ${token}`
      }
    })
  return data
}

//f8fed92a11c7b0bee9a4de7a87d167b04e3eff81


const getObjectFromData = (query) => {
  const { edges } = query.repository.issues;
  const res = edges.map(issue => {
    const { title, bodyText, number, id } = issue.node;
    const clearBodyText = bodyText.replace(/\n/g, '');
    const description = clearBodyText.split('Description')[1].split('Expected Results')[0];
    const expectedResults = clearBodyText.split('Description')[1].split('Expected Results')[1];
    return {
      subjectId: id,
      id: number,
      title,
      description,
      expectedResults
    }
  })
  return res;

  //  query.repository.issues.edges[0].node.bodyText.split('Description')[1].split('Expected Results')[0]

}

const queryApi = async (token) => {
  try {
    getRopesByUser();
    const data = await query(token);
    const res = getObjectFromData(data);
    console.log(res)
    return res;
  } catch (error) {
    console.log(error);

  }

}
const addLabelToIssue = async (issueId, version, label) => {
  try {

    //const result = await octokit.issues.createLabel({owner:"maty21", repo:"test", name:"testHub", color:"de3de3", description:""})
    const result2 = await octokit.issues.addLabels({ owner: "maty21", repo: "test", number: 1, labels: ["testHub"] })
  }
  catch (error) {
    console.log(error);

  }
}

commentAndLabel = async (version, id, result) => {
  commentMutation(id, version, result)

}

const getUserDetails = async (token) => {
  try {
    let obj = new Octokit();
    obj.authenticate({
      type: 'app',
      token
    })
    //   const repos = await obj.repos.getAll();
    const userDetails = await axios.get(`https://api.github.com/user?access_token=${token}`)
    const { name, login, avatar_url, organizations_url, repos_url } = userDetails.data;
    const repos = await axios.get(repos_url);
    //     console.log(repos);
    //  const specificRepo = await obj.repos.get({ owner: repos.data[0].owner.login, repo: repos.data[0].name });
    //    console.log(specificRepo);
    return (
      {
        name, login, avatar_url
        // repos: repos.data.map(r => r.full_name)
      })
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  query: queryApi,
  commentMutation: commentMutation,
  addLabelToIssue,
  commentAndLabel,
  getUserDetails
}