const express = require("express");

const UsersModel = require("./users-model");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("Hello from /");
});

server.post("/api/register", (req, res) => {
  const user = req.body;
});

server.post("/api/login", (req, res) => {});

server.get("/api/users", (req, res) => {
  UsersModel.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "There was an error getting the users." });
    });
});

module.exports = server;
