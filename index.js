const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

morgan.token('info', function getId (req) {
  return JSON.stringify(req.body);
})

// Middlewares
app.use(express.json()); // Sin esto, 'request.body' no estaría definida.
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'));
app.use(cors());
app.use(express.static('dist'));

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

const getRandomId = () => {
  const max = 99999;
  return Math.floor(Math.random() * max);
}

// Rutas
app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);

  if(person){
    response.json(person);
  }else{
    response.status(404).end();
  }
})

app.get('/info', (request, response) => {
  const now = new Date();
  const stringDate = now.toString();
  let _html = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${stringDate}</p>
  `;
  response.send(_html);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
})

app.post('/api/persons', (request, response) => {
  const person = request.body;

  if(!person.name){
    return response.status(400).json({
      error: "Name is missing"
    });
  }

  if(!person.number){
    return response.status(400).json({
      error: "Number is missing"
    });
  }

  const therIsCoincidence = persons.find(pers => pers.name.toLowerCase() == person.name.toLowerCase());
  if(therIsCoincidence){
    return response.status(409).json({
      error: `A person named '${person.name}' already exists in Phonebook`
    });
  }

  const newPerson = {
    name: person.name,
    number: person.number,
    id: getRandomId()
  };

  persons = persons.concat(newPerson);

  response.json(newPerson);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});