
           const { buildSchema } = require('graphql');
           module.exports = buildSchema(`scalar AnyObject
scalar JSON
scalar JSONObject
type FieldError {
  field: String!
  message: String!
}

type Query {
    dummy: Int
}

type Mutation {
    dummy: Int
}

type Subscription {
    dummy: Int
}

interface Node {
      id: ID!
}


schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
},# Database counter
type Counter {
  # Current amount
  amount: Int!
}

extend type Query {
  # Counter
  counter: Counter
}

extend type Mutation {
  # Increase counter value, returns current counter amount
  addCounter(
    # Amount to add to counter
    amount: Int
  ): Counter
}

extend type Subscription {
  # Subscription fired when anyone increases counter
  counterUpdated: Counter
}
`);
           