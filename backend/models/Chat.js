const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "ai"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true
    },
    messages: [messageSchema]
});

module.exports = mongoose.model("Chat", chatSchema);
