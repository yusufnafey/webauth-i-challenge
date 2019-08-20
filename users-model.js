const db = require("./db-config");

module.exports = {
  find,
  findBy,
  add,
  findById
};

function find() {
  return db("users").select("id", "username", "password");
}

function findBy(filter) {}

function add(user) {
  return db("users").insert(user);
}

function findById(id) {}
