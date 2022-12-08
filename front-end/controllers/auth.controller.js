const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
require("dotenv").config({ path: "../config/.env" });

// Create new user & encrypt its password
module.exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new userModel({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "utilisateur créé" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Compare user's email+password within the DB
module.exports.login = (req, res, next) => {
  userModel
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "L'identifiant ou le mot de passe est incorrecte" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((isValid) => {
            if (!isValid) {
              return res.status(401).json({
                message: "L'identifiant ou le mot de passe est incorrecte",
              });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, {
                  expiresIn: "24h",
                }),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
