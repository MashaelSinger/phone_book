const express = require('express')
const app = express()

app.use(express.json())

const PORT = 3001

let persons = [
  { id: "1", name: "mashael singer", number: "02933929" },
  { id: "2", name: "farah", number: "94430" },
  { id: "3", name: "noor", number: "3449929" } 
]


app.get('/api/persons', (req, res) => {
  res.json(persons)
})


app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})


app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(p => p.id === req.params.id)

  if (!person) {
    return res.status(404).json({ error: 'person not found' })
  }

  res.json(person)
})


app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(p => p.id !== req.params.id)
  res.status(204).end()
})


app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)

  res.status(201).json(newPerson)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})