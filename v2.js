const db = require('./db')

const express = require('express')
const expressGraphql = require('express-graphql')
const app = express()
const { makeExecutableSchema } = require('graphql-tools')

const typeDefs = `
  type Livro {
    id: ID!
    titulo: String!
    autor: Autor!
  }

  type Autor {
    id: ID!
    nome: String!
    livrosPublicados: [Livro!]!
  }

  type Query {
    livros: [Livro!]!
    autores: [Autor!]!
  }

  type Mutation {
    cadastrarLivro (titulo: String!, autorId: ID!): Livro
    cadastrarAutor (nome: String!): Autor
    removerAutor(autorId: ID!): Boolean
  }
`

const resolvers = {
  Livro: {
    autor: (livroAtual) => db.autores.find(autor => autor.id === livroAtual.autorId)
  },
  Autor: {
    livrosPublicados: (autorAtual) => db.livros.filter(livro => livro.autorId === autorAtual.id)
  },
  Query: {
    livros: () => db.livros,
    autores: () => db.autores
  },
  Mutation: {
    cadastrarAutor: (elPai, argumentos) => {
      const novoAutor = {
        id: db.autores.length + 1,
        nome: argumentos.nome
      }
      db.autores.push(novoAutor)
      return novoAutor
    },
    cadastrarLivro: (elPai, argumentos) => {
      const novoLivro = {
        id: db.autores.length + 1,
        titulo: argumentos.titulo,
        autorId: argumentos.autorId
      }
      db.livros.push(novoLivro)
      return novoLivro
    },
    removerAutor: (elPai, { autorId }) => {
      const posicaoAutor = db.autores.findIndex(autor => autor.id === autorId)
      db.autores.splice(posicaoAutor, 1)
      return true
    }
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

app.use('/graphql', expressGraphql({
  schema,
  graphiql: true
}))

app.listen(8080, () => {
  console.log('\nGraphQL on http://localhost:8080/graphql')
})