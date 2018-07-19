const express = require('express')
const expressGraphql = require('express-graphql')
const app = express()
const { makeExecutableSchema } = require('graphql-tools')
const fetch = require('node-fetch')

const URL_API = 'https://jsonplaceholder.typicode.com/users/'

const typeDefs = `
  type User {
    id: ID!
    name: String
    username: String
    phone: String
  }

  type Query {
    allUsers: [User!]!
    userById(id: ID!): User
  }
`

const resolvers = {
  Query: {
    allUsers: () => {
      return fetch(URL_API).then(res => res.json())
    },
    userById: (parent, { id }) => {
      return fetch(URL_API + id).then(res => res.json())
    }
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

app.use('/', expressGraphql({
  schema,
  graphiql: true
}))

app.listen(1234, () => {
  console.log('http://localhost:1234/')
})