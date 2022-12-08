const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: "./config/.env" });

const userRoutes = require("./routes/user.routes");
const sauceRoutes = require("./routes/sauce.routes");

const app = express();

// Connection to DataBase
mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_PASS +
      "@projet6.c5rfnv1.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée !", error));

// Fix CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Parse the data into json format
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
