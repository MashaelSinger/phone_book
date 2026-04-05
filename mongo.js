const mongoose = require('mongoose')
const url = 'mongodb+srv://Mashael:MDajt7naRg6Z-G2@cluster0.gj05jsz.mongodb.net/phonebookApp?retryWrites=true&w=majority'
mongoose.connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log('error connecting to MongoDB:', err.message))
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)
const name = process.argv[2]
const number = process.argv[3]
//if i didnot give it the name or any argument he will list what is in the phonebook//
if (!name) {
  Person.find({}).then(persons => {
    console.log('Phonebook:')
    persons.forEach(p => console.log(`${p.name} ${p.number}`))
    mongoose.connection.close()
  })
} 
//if i didnot give it a number//
else if (!number) {
  console.log('Please provide a number as well.')
  mongoose.connection.close()
}
 else {
  const person = new Person({ name, number })
  person.save().then(() => {
    console.log(`successfully added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}