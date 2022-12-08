const router = require("express").Router();
const authController = require("../controllers/auth.controller");

// Create new user
router.post("/signup", authController.signup);

// User Login
router.post("/login", authController.login);

module.exports = router;
