const express = require("express");
const bcrypt = require("bcryptjs");

const UsersModel = require("./users-model");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("Hello from /");
});

server.post("/api/register", (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  if (!user.username || !user.password) {
    res.status(400).json({
      message: "Please provide username and password for the new user."
    });
  } else {
    UsersModel.add(user)
      .then(users => {
        console.log(users);
        res.status(201).json(users);
      })
      .catch(error => {
        res
          .status(500)
          .json({ message: "There was an error registering the user." });
      });
  }

  // UsersModel.add(user)
  //   .then(users => {
  //     res.status(201).json(users);
  //   })
  //   .catch(error => {
  //     res
  //       .status(500)
  //       .json({ message: "There was an error registering the user. " });
  //   });
});

server.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  UsersModel.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: "Logged in." });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "There was an error logging in." });
    });
});

server.get("/api/users", restricted, (req, res) => {
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

// =========== RESTRICTED FUNCTION ===========
function restricted(req, res, next) {
  let { username, password } = req.headers;

  if (username && password) {
    UsersModel.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "You shall not pass!" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res.status(400).json({ message: "You shall not pass!" });
  }
}

module.exports = server;
