const dynamoDB = require("../modules/db.js");
const { composeResolvers } = require("@graphql-tools/resolvers-composition");

const resolvers = {
  Query: {
    User: () => ({}),
  },
  User: {
    __resolveReference(groupRepresentation) {
      return dynamoDB.getUser(
        groupRepresentation.id,
        false
      );
    },
  },
  UserQuery: {
    user: (_, { id, email }) => dynamoDB.getUser(id, false),
    users: () => dynamoDB.getAllUser(),
  },
  Mutation: {
    User: () => ({}),
  },
  UserMutation: {
    createUser: (_, { input }) => dynamoDB.createUser(input),
    deleteUser: (_, { id }) => dynamoDB.deleteUser(id),
    updateUser: (_, { id, input }) => dynamoDB.updateUser(id, input),
  },
};

const permissions = {
};
const composedResolvers = composeResolvers(resolvers, permissions);

module.exports = composedResolvers;
