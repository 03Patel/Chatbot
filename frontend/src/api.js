
import axios from "axios";

const API = axios.create({
  baseURL: "https://chatbot-qf2g.onrender.com/api"
});

export const sendMessageToAI = (message, sessionId) =>
  API.post("/chat", { message, sessionId });

export const fetchHistory = (sessionId) =>
  API.get(`/chat/${sessionId}`);
