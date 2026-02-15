require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(express.json());


mongoose
  .connect("mongodb+srv://ganeshjipatel108_db_user:MKC3rkydGp6YfuLG@cluster0.4jxroaa.mongodb.net/?appName=Cluster0)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api", chatRoutes);
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
