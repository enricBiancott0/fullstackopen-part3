require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('build'))

// step 8
morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body'))

// step 1
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons=> {
        response.json(persons)
    })
})

// step 2
app.get('/info', (request, response) => {
    response.send(`<div><p>Phonebook has info for ${persons.length} people</p><p> ${new Date().toString()}</p></div>`)
})

// step 3
app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            response.json(person)
        })
})

// step 4
app.delete('/api/persons/:id', (request, response) => {
    Person
        .deleteOne({ _id: request.params.id })
        .then(person => {
            response.status(204).end()
        })
        .catch(err => {
            response.json({
                error: err
            })
        })
        
})

// step 5
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})