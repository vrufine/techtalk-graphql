const db = require('./db')

const app = require('express')()

app.get('/', (req, res) => {
  res.send(`
  <ul>
    <li>
      <a href="/autores">/autores</a>
    </li>
    <li>
      <a href="/livros">/livros</a>
    </li>
  </ul>
  `)
})

// Livro
app.get('/livros', (req, res) => {
  res.send(db.livros)
})
app.get('/livros/:id', (req, res) => {
  res.send(db.livros.find(livro => livro.id === parseInt(req.params.id)))
})
// app.get('/livrosSohTitulo', (req, res) => {
//   res.send(db.livros.map(livro => ({ titulo: livro.titulo })))
// })
// app.get('/livrosTituloNomeAutor', (req, res) => {
//   res.send(
//     db.livros.map(livro => ({
//       titulo: livro.titulo,
//       autor: {
//         nome: db.autores.find(autor => autor.id === livro.autorId).nome
//       }
//     }))
//   )
// })

app.get('/autores', (req,res) => {
  res.send(db.autores)
})
app.get('/autores/:id', (req, res) => {
  res.send(db.autores.find(autor => autor.id === parseInt(req.params.id)))
})
// app.get('/autoresSohNome', (req, res) => {
//   res.send(
//     db.autores.map(autor => ({nome: autor.nome}))
//   )
// })

app.listen(9090, () => {
  console.log('\nREST on http://localhost:9090/')
})
