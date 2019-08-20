const db = require("./db-config");

module.exports = {
  find,
  findBy,
  add
};

function find() {
  return db("users").select("id", "username", "password");
}

function findBy(filter) {
  return db("users").where(filter);
}

function add(user) {
  return db("users").insert(user);
}
