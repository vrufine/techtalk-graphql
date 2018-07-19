const express = require('express')
const expressGraphql = require('express-graphql')
const app = express()
const { makeExecutableSchema } = require('graphql-tools')

const db = {
  livros: [
    { id: 1, titulo: 'Sherlock Holmes', autorId: 33 }
  ],
  autores: [
    { id: 33, nome: 'Conan Doyle' }
  ]
}

const typeDefs = `
  type Livro {
    id: ID!
    titulo: String!
    autor: Autor!
  }

  type Autor {
    id: ID!
    nome: String!
    livros: [Livro!]!
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
    autor: (livroAtual) => {
      return db.autores.find(autor => autor.id === livroAtual.autorId)
    }
  },
  Autor: {
    livros: (autorAtual) => db.livros.filter(livro => livro.autorId === autorAtual.id)
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

app.listen(8080)