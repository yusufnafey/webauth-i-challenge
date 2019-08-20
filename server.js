const express = require("express");

const UsersModel = require("./users-model");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("Hello from /");
});

server.post("/api/register", (req, res) => {
  const user = req.body;

  if (!user.username || !user.password) {
    res.status(400).json({
      message: "Please provide username and password for the new user."
    });
  } else {
    UsersModel.add(user)
      .then(users => {
        res.status(201).json(users);
      })
      .catch(error => {
        res
          .status(500)
          .json({ message: "There was an error registering the user. " });
      });
  }
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
