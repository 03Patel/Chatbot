const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getChatHistory
} = require("../controllers/chatController");


router.post("/chat", sendMessage);


router.get("/chat/:sessionId", getChatHistory);

module.exports = router;
