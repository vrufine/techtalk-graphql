const express = require('express')
const graphqlHttp = require('express-graphql')
const app = express()

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')

const db = {
  livros: [
    { id: 1, titulo: 'Sherlock Holmes', autorId: 33 }
  ],
  autores: [
    { id: 33, nome: 'Conan Doyle' }
  ]
}

// Definição de tipos
const AutorType = new GraphQLObjectType({
  name: 'Autor',
  fields: {
    id: { type: GraphQLID },
    nome: { type: GraphQLString }
  }
})

const LivroType = new GraphQLObjectType({
  name: 'Livro',
  fields: {
    id: { type: GraphQLID },
    titulo: { type: GraphQLString },
    autor: {
      type: AutorType,
      resolve: (livro) => db.autores.find(autor => autor.id === livro.autorId)
    }
  }
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      autores: {
        type: new GraphQLList(AutorType),
        resolve: () => db.autores
      },
      livros: {
        type: new GraphQLList(LivroType),
        resolve: () => db.livros
      },
      livroById: {
        type: LivroType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID)}
        },
        resolve: (p, { id }) => db.livros.find(livro => livro.id == id)
      }
    }
  })
})

app.use(
  '/graphql',
  graphqlHttp({
    schema,
    graphiql: true
  })
)

app.listen(8080)