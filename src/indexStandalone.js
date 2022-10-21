// graphql.js
"use strict";
const { ApolloServer } = require( "@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers,
    csrfPrevention: true,
  })
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀  Server ready at: ${url}`);
}
startServer();
  
