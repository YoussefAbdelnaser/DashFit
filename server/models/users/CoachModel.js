const mongoose = require("mongoose");
const Joi = require("joi");

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
});

const coachValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  age: Joi.number().integer().min(18).required(),
  phoneNumber: Joi.number().integer().min(1000000000).required(),
  image: Joi.string().uri().required(),
  role: Joi.string().valid("Trainee", "Coach").required(),
  subscriptionsOffred: Joi.array()
    .items(Joi.string().length(24).hex())
    .required(),
});

const validateCoach = (coach) => coachValidationSchema.validate(coach);
const Coach = mongoose.model("Coach", coachSchema);
module.exports = { Coach, validateCoach };
