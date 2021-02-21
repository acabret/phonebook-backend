const express = require("express");
require('dotenv').config();
const app = express();
const cors = require("cors");
const isValidNumber = require("./helpers.js");
const morgan = require("morgan");

const {
  doSomething,
  checkNameAvailability,
  addNewPerson,
  getAllPersons,
  getPerson,
  deletePerson,
} = require("./Phonebook.js");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

const morganToken = morgan.token("dataSent", function (req, res) {
  return JSON.stringify(req.body);
});

// const tinyConfig = morgan('tiny');
const tinyConfig = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.dataSent(req, res),
  ].join(" ");
},{
  skip: function(req, res) { return !(req.method==="POST") }
});
// const tinyConfig = morgan(':method :url :status');

app.use(tinyConfig);

// const corsOptions = {
//   origin: "http://localhost",
//   optionsSuccessStatus: 200, // For legacy browser support
// };

app.get("/api/something", (request, response) => {
  doSomething(response);
  console.log("does it get here?");
});

// app.get("/api/persons", (request, response, next) => {
//   console.log("desde el middleware");
//   // console.log(request.method);
//   next();
//   // response.json(persons);
// });

app.get("/api/persons", (request, response) => {
  // console.log(request.headers);
  response.json(getAllPersons());
  // response.json(persons);
});

app.get("/info", (request, response) => {
  // const htmlPayload = `Phonebook has info for ${persons.length}<br>
  //   ${new Date()}`;
  const htmlPayload = `Phonebook has info for ${getAllPersons().length}<br>
    ${new Date()}`;

  response.send(htmlPayload);
});

// const generateId = () => {
//   const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
//   return maxId + 1;
// };

app.post("/api/persons", (request, response) => {
  // console.log("entrando post api/persons");
  const { name, number } = request.body;
  console.log("testing UI number =", typeof number);
  
  // console.log(request.body);
  if (!name || !number) {
    response
      .status(400)
      .send({ status: "400 - bad request", message: "Missing key properties" });
    console.log("falta propiedades");
    return;
  }

  if (isValidNumber(number)) {
    if (checkNameAvailability(name)) {
      console.log("nombre disponible supuestamente");
      const newPerson = {
        name,
        number,
        // id: generateId(),
        // date: new Date().toISOString(),
      };

      addNewPerson(newPerson);
      // persons = persons.concat(newPerson);

      response.status(201).json({
        status: "201 - resource created",
        message: "success",
        payload: newPerson,
      });
      // console.log('despues de "creado"');
      return;
    } else {
      console.log("nombre no disponible, fuiste");
      response
        .status(400)
        .send({ status: "400 - bad request", message: "nombre repetido" });
    }
  } else {
    response
      .status(400)
      .send({ status: "400 - bad request", message: "id not valid" });
  }

  // console.log(`esta disponible el nombre ${name}`,checkNameAvailability(name))

  // console.log("lista desde index.js variable persons", persons)

  // console.log("lista desde el modulo persons.js", require("./persons.js"));

  // const newPerson = {
  //   name,
  //   number,
  //   id: generateId(),
  //   date: new Date().toISOString(),
  // };

  // persons = persons.concat(newPerson);

  // response.status(201).json({
  //   status: "201 - resource created",
  //   message: "success",
  //   payload: newPerson,
  // });
  // console.log('despues de "creado"');
  // return;
});

app.get("/api/persons/:id", (request, response) => {
  const personId = parseInt(request.params.id);

  if (!isValidNumber(personId)) {
    response
      .status(400)
      .send({ status: "400 - bad request", message: "Id is not a number" });
    return;
  } else {
    // const person = persons.find((per) => per.id === personId);
    const person = getPerson(personId);

    if (!person) {
      response.status(404).send({
        status: "404 - not found",
        message: "no person exists with given id",
      });
    } else {
      response.send({ status: "200 - succeed", payload: person });
    }
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const personId = parseInt(request.params.id);

  if (!isValidNumber(personId)) {
    response
      .status(400)
      .send({ status: "400 - bad request", message: "Id is not a number" });
    return;
  }

  const person = getPerson(personId);

  if (person) {
    deletePerson(personId);

    response.json({
      status: "200 - succeed",
      message: `${personId} it's been deleted`,
      payload: person,
    });
  } else {
    response.status(404).send({
      status: "404 - not found",
      message: "no person exists with given id",
    });
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

console.log(process.env.PORT);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
