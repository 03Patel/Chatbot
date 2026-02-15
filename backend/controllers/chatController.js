const axios = require("axios");
const Chat = require("../models/Chat");


const MODEL_NAME = "openai/gpt-oss-20b";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ error: "Message and sessionId required" });
    }

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL_NAME,
        messages: [
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 512
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
      }
    );

    const aiReply =
      response.data?.choices?.[0]?.message?.content ||
      "No response from AI";


    let chat = await Chat.findOne({ sessionId });
    if (!chat) {
      chat = new Chat({ sessionId, messages: [] });
    }

    chat.messages.push({ role: "user", content: message });
    chat.messages.push({ role: "ai", content: aiReply });

    await chat.save();

    res.json({ reply: aiReply });

  } catch (error) {
    console.error("GROQ ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const chat = await Chat.findOne({ sessionId });
    res.json({ messages: chat?.messages || [] });
  } catch (error) {
    console.error("History Error:", error.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};
