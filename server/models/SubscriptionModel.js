const mongoose = require("mongoose");
const Joi = require("joi");

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
  coach: { type: mongoose.Schema.ObjectId, ref: "Coach" },
  trainees: [{ type: mongoose.Schema.ObjectId, ref: "Trainee" }],
  prevPlans: [{ type: mongoose.Schema.ObjectId, ref: "Plan" }],
  currPlan: { type: mongoose.Schema.ObjectId, ref: "Plan" },
});

const subscriptionValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().greater(0).required(),
  duration: Joi.string()
    .valid("1 month", "3 months", "6 months", "12 months")
    .required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
  coach: Joi.string().length(24).hex(),
  trainees: Joi.array().items(Joi.string().length(24).hex()),
  prevPlans: Joi.array().items(Joi.string().length(24).hex()).allow(null),
  currPlan: Joi.string().length(24).hex().allow(null),
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
const validateSubscription = (subscription) =>
  subscriptionValidationSchema.validate(subscription);

module.exports = { Subscription, validateSubscription };
