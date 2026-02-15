
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const sendMessageToAI = (message, sessionId) =>
  API.post("/chat", { message, sessionId });

export const fetchHistory = (sessionId) =>
  API.get(`/chat/${sessionId}`);
