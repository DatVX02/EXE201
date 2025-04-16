const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/", messageController.sendMessage);
router.get("/", messageController.getMessages);
router.get("/assigned-carts", messageController.getAssignedCarts);

module.exports = router;
