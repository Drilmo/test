const { gql } = require("apollo-server-lambda");

const root = gql`
    extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0",
          import: ["@key", "@shareable","@provides","@external"])
`;

module.exports = root;
