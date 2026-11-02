const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },

    address: {
        street: { type: String, required: true },
        landmark: { type: String, required: true },
        area: { type: String, required: true },
        pincode: { type: String, required: true }
    }
});

module.exports = mongoose.model("User", userSchema);