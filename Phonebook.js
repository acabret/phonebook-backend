const { response } = require("express");
let persons = require("./persons.js");
const express = require("express");

function checkNameAvailability(name) {
  //   console.log("lista desde modulo phonebook.js", persons);
  const isAvailable = persons.find((person) => person.name === name)
    ? false
    : true;

  return isAvailable;
}

function addNewPerson(personInfo) {
  const newPerson = { ...personInfo, id: generateId(), date: new Date() };

  persons = persons.concat(newPerson);
}

function getPerson(id) {
  return persons.find((person) => person.id === id);
}

function getAllPersons() {
  return persons;
}

function deletePerson(id) {
  persons = persons.filter((person) => person.id !== id);
}

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

const doSomething = (response) => {
  console.log("doing something");
  response.json({ something: "asd" });
  return;
};

module.exports = {
  doSomething,
  checkNameAvailability,
  addNewPerson,
  getAllPersons,
  getPerson,
  deletePerson,
};
