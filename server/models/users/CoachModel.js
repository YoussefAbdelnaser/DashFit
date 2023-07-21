const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const coachSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  phoneNumber: { type: Number, required: true, unique: true },
  image: { type: String, required: true },
  role: {
    type: String,
    enum: ["Trainee", "Coach"],
    required: true,
    default: "Coach",
  },
  subscriptionsOffred: [
    { type: mongoose.Schema.ObjectId, ref: "Subscription", required: true },
  ],
  trainees: [
    { type: mongoose.Schema.ObjectId, ref: "Trainee", required: true },
  ],
});

module.exports = mongoose.model("Coach", coachSchema);
