// graphql.js
"use strict";
const { ApolloServer } = require("apollo-server-lambda");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers,
    csrfPrevention: true,
  }),
  context: ({ express }) => {
    const user = express.req.headers.user
      ? JSON.parse(express.req.headers.user)
      : null;
    return { user };
  },
});

exports.graphqlHandler = server.createHandler();
