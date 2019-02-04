const { ApolloServer, gql } = require('apollo-server-express');
const express =require('express');
const randomString = require('randomstring');
const qs = require('querystring');
const redirect_uri = 'http://localhost:3000' + '/api/github/callback';
const {query,commentMutation,addLabelToIssue,commentAndLabel,getUserDetails} = require('./app');
const  githubAuth = require("./github-oauth");

const api = require('./api');
// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Issue {
    subjectId:String
    id: Int
    title: String
    description: String
    expectedResults:String
  }
  type UserInfo{
    name:String
    login:String
    avatar_url:String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    issues(token:String!): [Issue]
    userDetails(token:String!):UserInfo
  }

  


  type Mutation {
    addComment(version: String!): String,
    addLabel(label: String!) : String
    addCommentAndLabel(id: String!,result:String!,version: String!): String,
  }

`;


// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    issues: async(root, args) => {
      const data =await query(args.token);
      return data;
    },
    userDetails: async(root, args) => {
      const data =await getUserDetails(args.token);
      return data;
    }
  },
  Mutation: {
    addComment: async(root, args) => {
    const data = await commentMutation(args.version)
      return data;
    },
    addLabel:async(root, args) => {
      const data = await addLabelToIssue()
        return "data";
      },
      addCommentAndLabel:async(root, args) => {
        const data = await commentAndLabel(args.version,args.id,args.result);
          return "data";
        }
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
app.get('/github',(req,res)=>{
  let data =githubAuth.login(req,res)
  console.log(data);
  
})
app.use('/api', api);
app.get('/login', (req, res) => {
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
server.applyMiddleware({ app });

const port = process.env.PORT||'4000';

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`),
);