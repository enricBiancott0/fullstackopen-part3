const mongoose = require('mongoose')

if (process.argv.length < 2 || process.argv.length > 5) {
  console.log('Please provide the password as an argument: node mongo.js <password> <name> <number>')
  process.exit(1)
}

const mongoPwd = process.argv[2]

const url = `mongodb://fullstack:${mongoPwd}@ac-stenzlo-shard-00-00.0slh487.mongodb.net:27017,ac-stenzlo-shard-00-01.0slh487.mongodb.net:27017,ac-stenzlo-shard-00-02.0slh487.mongodb.net:27017/phoneBookApp?ssl=true&replicaSet=atlas-wv91cv-shard-0&authSource=admin&retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Generate new person
if (process.argv.length > 3) {
  const personName = process.argv[3]
  const personNumber = process.argv[4]
  
  console.log('trying to connect to MongoDb')
  mongoose
    .connect(url)
    .then((result) => {
      console.log('Connected')

      const person = new Person({
        name: personName,
        number: personNumber
      })

      return person.save()
    })
    .then(() => {
      console.log(`Added ${personName} ${personNumber} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
} else {
  console.log('trying to connect to MongoDb')
  mongoose
    .connect(url)
    .then((result) => {
      console.log('Connected\nphonebook')
      
      Person.find({}).then(persons => {
        persons.forEach(person => {
          console.log(person.name, ' ', person.number)
        })
        mongoose.connection.close()
      })
    })
    .catch((err) => console.log(err))
}