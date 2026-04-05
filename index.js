
const express = require('express')
const app = express()
const Person = require('./mongo') 
app.use(express.json())
const PORT = 3001

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(err => next(err))
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const date = new Date()
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      `)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person)
      else res.status(404).json({ error: 'person not found' })
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body
  if (!name || !number) {
    return res.status(400).json({ error: 'enter both name and number' })
  }
  const person = new Person({ name, number })
  person.save()
    .then(savedPerson => res.status(201).json(savedPerson))
    .catch(err => next(err))
})


app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true })
    .then(updatedPerson => {
      if (updatedPerson) res.json(updatedPerson)
      else res.status(404).json({ error: 'person not found' })
    })
    .catch(err => next(err))
})


const errorHandler = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })}
  console.error(err.message)
  res.status(500).json({ error: 'Something went wrong' })
}

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))