const { gql } = require("graphql-tag");

// Construct a schema, using GraphQL schema language
const user = gql`
  # Define the model User
  type User @key(fields: "id") {
    "The id of the User"
    id: ID! @shareable
    "The pseudo of the User"
    pseudo: String!
  }

  # Define the input for the mutation
  input UserInput {
    "The pseudo of the user"
    pseudo: String!
  }

  # Define the queries
  extend type Query {
    User: UserQuery
  }

  type UserQuery {
    "Get the user by id or email"
    user(id: ID, email: String): User!
    "Get all the users"
    users: [User!]
  }

  type UserMutation {
    "create a new user"
    createUser(input: UserInput!): User
    "update an existing user"
    updateUser(id: ID!, input: UserInput!): User
    "delete an existing user"
    deleteUser(id: ID!): Boolean
  }
  # Define the mutations
  extend type Mutation {
    User: UserMutation
  }
`;
module.exports = user;
