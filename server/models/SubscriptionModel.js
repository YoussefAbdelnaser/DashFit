const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: {
    type: String,
    enum: ["1 month", "3 months", "6 months", "12  months"],
    required: true,
  },
  coach: { type: mongoose.Schema.ObjectId, ref: "Coach", required: true },
  trainees: [
    { type: mongoose.Schema.ObjectId, ref: "Trainee", required: true },
  ],
  prevPlans: [{ type: mongoose.Schema.ObjectId, ref: "Plan" }],
  currPlan: { type: mongoose.Schema.ObjectId, ref: "Plan" },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
