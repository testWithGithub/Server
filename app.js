const graphql = require('@octokit/graphql')


const query =async ()=>{
    const { data } = await graphql(`{ repository(owner:"maty21" name:"test"){
        issues(last:100){
        edges{
          node{
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
          authorization: `token f8fed92a11c7b0bee9a4de7a87d167b04e3eff81`
        }
    })
    return data
}

//f8fed92a11c7b0bee9a4de7a87d167b04e3eff81


const getObjectFromData = (query)=>{
    const {edges}=  query.repository.issues;
    const res = edges.map(issue=>{
        const {title,bodyText,number} = issue.node;
        const clearBodyText= bodyText.replace(/\n/g, '');
        const description = clearBodyText.split('Description')[1].split('Expected Results')[0];
        const expectedResult = clearBodyText.split('Description')[1].split('Expected Results')[1];
        return {
            id:number,
            title,
            description,
            expectedResult
        }
    })
    return res;
    
  //  query.repository.issues.edges[0].node.bodyText.split('Description')[1].split('Expected Results')[0]
  
}

const queryApi = async() =>{
 const data = await query();
    const res = getObjectFromData(data);
    console.log(res)
    return res;
}
  

      module.exports = {
        query :queryApi
      }