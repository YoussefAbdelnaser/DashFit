const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const traineeSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  phoneNumber: { type: Number, required: true, unique: true },
  image: { type: String },
  role: {
    type: String,
    enum: ["Trainee", "Coach"],
    required: true,
    default: "Trainee",
  },
});

module.exports = mongoose.model("Trainee", traineeSchema);
