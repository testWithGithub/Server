const { ApolloServer, gql } = require('apollo-server');
const {query,commentMutation,addLabelToIssue} = require('./app');
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

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    issues: [Issue]
  }

  


  type Mutation {
    addComment(version: String!): String,
    addLabel(label: String!) : String
   
  }

`;


// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    issues:  query,
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
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});