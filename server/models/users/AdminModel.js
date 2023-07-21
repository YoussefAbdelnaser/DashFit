const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  role: {
    type: String,
    enum: ["Admin"],
    required: true,
  },
  image: { type: String },
});

module.exports = mongoose.model("Admin", adminSchema);
