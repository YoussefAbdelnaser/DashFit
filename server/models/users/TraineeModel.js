const mongoose = require("mongoose");
const Joi = require("joi");

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
  subscription: { type: mongoose.Schema.ObjectId, ref: "Subscription" },
});

const traineeValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  age: Joi.number().integer().min(18).required(),
  phoneNumber: Joi.number().integer().min(1000000000).required(),
  image: Joi.string().uri().allow(null, ""),
  role: Joi.string().valid("Trainee", "Coach").required(),
  subscription: Joi.string().length(24).hex().allow(null),
});

const Trainee = mongoose.model("Trainee", traineeSchema);
const validateTrainee = (trainee) => traineeValidationSchema.validate(trainee);

module.exports = { Trainee, validateTrainee };
