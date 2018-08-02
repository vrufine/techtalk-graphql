const app = require('express')()
const db = require('./db')

// Livro
app.get('/livros', (req, res) => {
  res.send(db.livros)
})
app.get('/livros/:id', (req, res) => {
  res.send(db.livros.find(livro => livro.id === parseInt(req.params.id)))
})

// Autor
app.get('/autores', (req, res) => {
  res.send(db.autores)
})
app.get('/autores/:id', (req, res) => {
  res.send(db.autores.find(autor => autor.id === parseInt(req.params.id)))
})

app.listen(9090, () => {
  
  console.log('\nListening on http://localhost:9090/')
})
