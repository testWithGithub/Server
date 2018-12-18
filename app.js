const graphql = require('@octokit/graphql');
const Octokit = require('@octokit/rest');
const { request, GraphQLClient } = require('graphql-request');
//https://api.github.com/graphql
const client = new GraphQLClient('https://api.github.com/graphql', { headers: { authorization: `token 4dd3a40b11d0e39736852dc8969a702269e3f48e`} })
const query =async ()=>{
    const { data } = await graphql(`{ repository(owner:"maty21" name:"test"){
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
    }`,{
        headers: {
          authorization: `token 052645882dea5cdb43d767e254e20cc591679e20`
        }
    })
    return data
}
const octokit = new Octokit()
// octokit.authenticate({
//   type: 'basic',
//   username: 'maty21',
//   password: 'Mmki8ki8'
// })
octokit.authenticate({
  type: 'oauth',
  token: ''
})
const commentMutation =async (version) =>{
  const { data } = await graphql(`mutation {
    addComment(input:{clientMutationId: "2", subjectId: "MDU6SXNzdWUzODkwNTExNDQ=", body: "${version}"}) {
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
  }`,{
    headers: {
      authorization: `token `
    }
})
return data
}
const commentMutation1 =async (version) =>{
  try {
    const { data } = await client.request(`mutation {
      addComment(input:{clientMutationId: "2", subjectId: "MDU6SXNzdWUzODkwNTExNDQ=", body: "${version}"}) {
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
    }`
  )
  return data
  } catch (error) {
    console.log(error);
    
  }
  
}
//f8fed92a11c7b0bee9a4de7a87d167b04e3eff81


const getObjectFromData = (query)=>{
    const {edges}=  query.repository.issues;
    const res = edges.map(issue=>{
        const {title,bodyText,number,id} = issue.node;
        const clearBodyText= bodyText.replace(/\n/g, '');
        const description = clearBodyText.split('Description')[1].split('Expected Results')[0];
        const expectedResults = clearBodyText.split('Description')[1].split('Expected Results')[1];
        return {
           subjectId:id,
            id:number,
            title,
            description,
            expectedResults
        }
    })
    return res;
    
  //  query.repository.issues.edges[0].node.bodyText.split('Description')[1].split('Expected Results')[0]
  
}

const queryApi = async() =>{
  try {
    const data = await query();
    const res = getObjectFromData(data);
    console.log(res)
    return res;   
  } catch (error) {
    console.log(error);
    
  }
 
}
const addLabelToIssue = async(issueId,version,label) => {
  try {
    
    //const result = await octokit.issues.createLabel({owner:"maty21", repo:"test", name:"testHub", color:"de3de3", description:""})
    const result2 = await octokit.issues.addLabels({owner:"maty21", repo:"test",  number:1, labels:["testHub"]})
  }
   catch (error) {
    console.log(error);
      
  }
}

      module.exports = {
        query :queryApi,
        commentMutation:commentMutation,
        addLabelToIssue
      }