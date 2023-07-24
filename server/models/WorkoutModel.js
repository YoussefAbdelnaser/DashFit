const mongoose = require("mongoose");
const Joi = require("joi");

const workoutSchema = new mongoose.Schema({
  title: {
    type: String,
    enum: [
      "Pilates",
      "Aerobic",
      "Strength training",
      "Yoga",
      "Circuit training",
      "Cycling",
      "Running",
      "Walking",
      "High-intensity interval training",
      "Swimming",
      "Boxing",
      "Dance",
      "Tai chi",
      "Hiking",
      "Elliptical",
      "Stretching",
      "Kickboxing",
      "Stair Stepper",
      "Push-up",
      "Squat",
      "Weightlifting",
      "Water aerobics",
      "Lunge",
      "Interval training",
    ],
    required: true,
  },

  description: { type: String, required: true },
  workoutSpecifications: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "WorkoutSpecifications",
      required: true,
    },
  ],
});

const workoutValidationSchema = Joi.object({
  title: Joi.string()
    .valid(
      "Pilates",
      "Aerobic",
      "Strength training",
      "Yoga",
      "Circuit training",
      "Cycling",
      "Running",
      "Walking",
      "High-intensity interval training",
      "Swimming",
      "Boxing",
      "Dance",
      "Tai chi",
      "Hiking",
      "Elliptical",
      "Stretching",
      "Kickboxing",
      "Stair Stepper",
      "Push-up",
      "Squat",
      "Weightlifting",
      "Water aerobics",
      "Lunge",
      "Interval training"
    )
    .required(),
  description: Joi.string().required(),
  workoutSpecifications: Joi.array()
    .items(Joi.string().length(24).hex())
    .required(),
});

const Workout = mongoose.model("Workout", workoutSchema);
const validateWorkout = (workout) => workoutValidationSchema.validate(workout);

module.exports = { Workout, validateWorkout };
