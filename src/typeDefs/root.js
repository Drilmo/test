const { gql } = require("graphql-tag");

const root = gql`
    extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0",
          import: ["@key", "@shareable","@provides","@external"])
`;

module.exports = root;
