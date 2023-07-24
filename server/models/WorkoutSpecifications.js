const mongoose = require("mongoose");

const workoutSpecificationsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sets: { type: Number, required: true },
  repetitions: { type: Number, required: true },
  description: { type: String, required: true },
  image: [{ type: String }],
});

const workoutSpecificationsValidationSchema = Joi.object({
  title: Joi.string().required(),
  sets: Joi.number().integer().greater(0).required(),
  repetitions: Joi.number().integer().greater(0).required(),
  description: Joi.string().required(),
  image: Joi.array().items(Joi.string().uri()).allow(null),
});

const WorkoutSpecifications = mongoose.model(
  "WorkoutSpecifications",
  workoutSpecificationsSchema
);
const validateWorkoutSpecifications = (workoutSpecifications) =>
  workoutSpecificationsValidationSchema.validate(workoutSpecifications);

module.exports = { WorkoutSpecifications, validateWorkoutSpecifications };
