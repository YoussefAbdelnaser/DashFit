const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const planSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  workout: { type: String, required: true },
  diet: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

module.exports = mongoose.model("Plan", planSchema);
