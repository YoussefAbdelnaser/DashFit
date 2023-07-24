const mongoose = require("mongoose");
const Joi = require("joi");

const Schema = mongoose.Schema;

const planSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  workout: { type: String, required: true },
  diet: { type: mongoose.Schema.ObjectId, ref: "Diet", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: { type: Number },
});

//calculating duartion using start and end dates
planSchema.pre("save", function (next) {
  const startDate = this.startDate;
  const endDate = this.endDate;

  const diff = endDate.getTime() - startDate.getTime();

  const diffInDays = diff / (1000 * 60 * 60 * 24);

  this.duration = diffInDays;

  next();
});

const planValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  workout: Joi.string().required(),
  diet: Joi.string().length(24).hex().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
  duration: Joi.number().integer().greater(0).allow(null),
});

const validatePlan = (plan) => planValidationSchema.validate(plan);
const Plan = mongoose.model("Plan", planSchema);

module.exports = { Plan, validatePlan };
