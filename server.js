const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const UsersModel = require("./users-model");

const server = express();
const knexConnection = require("./db-config");

server.use(express.json());
server.use(session(sessionOptions));

// =========== SESSION OPTIONS ===========
const sessionOptions = {
  name: "testsession",
  secret: process.env.COOKIE_SECRET,
  cookie: {
    secure: process.env.COOKIE_SECURE || false,
    maxAge: 1000 * 60 * 60,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: knexConnection,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.get("/", (req, res) => {
  res.send("Hello from /");
});

// =========== REGISTER ===========
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
});

// =========== LOG IN ===========
server.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  UsersModel.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = user.username;
        req.session.loggedIn = true;
        res.status(200).json({ message: "Logged in." });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "There was an error logging in." });
    });
});

// =========== GET USERS ===========
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

// =========== LOG OUT ===========
server.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ bye: user.username });
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
