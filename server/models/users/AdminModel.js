const mongoose = require("mongoose");
const Joi = require("joi");

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

const adminValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  age: Joi.number().integer().min(18).required(),
  role: Joi.string().valid("Admin").required(),
  image: Joi.string().uri().allow(null, ""),
});

const validateAdmin = (admin) => adminValidationSchema.validate(admin);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = { Admin, validateAdmin };
