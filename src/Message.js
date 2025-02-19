const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    timestamp: { type: Number, required: true },
    message_sent: { type: String, required: true },
    user: { type: String, required: true } // Added user field to track recipients
});

module.exports = mongoose.model("Message", messageSchema);
