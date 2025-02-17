const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema({
    name: String
    , email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String
    }
    
}, { timestamps: true })

const Email = mongoose.model("Email", EmailSchema);
module.exports = Email