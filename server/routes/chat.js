const express = require("express");
const router = express.Router();
const User = require("../Models/user");
const {
  chatGetController,
  chatPostController,
} = require("../controllers/chat_controller");
const { requireAuth } = require("../middleware/auth");



/* GET users listing. */
router.get("/", requireAuth, chatGetController);

router.post("/",requireAuth, chatPostController);

module.exports = router;

