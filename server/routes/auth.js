var express = require("express");
var router = express.Router();
const User = require("../Models/user");
const users_controller = require("../controllers/auth-controller");

/* GET home page. */

router.post("/signup", users_controller.signup);

router.post("/login", users_controller.login);

router.get("/logout", (req, res) => {
  res.cookie("jwt", " ", { maxAge: 1 });
  res.send("logged out");
});

router.get("/:id", users_controller.confirmation);

module.exports = router;
