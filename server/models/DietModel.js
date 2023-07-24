const mongoose = require("mongoose");

const dietSchema = new mongoose.Schema({
  title: {
    type: String,
    enum: [
      "Ketogenic",
      "Mediterranean",
      "Gluten-Free",
      "Veganism",
      "Plant-Based",
      "Intermittent Fasting",
      "Raw Food",
      "Vegetarianism",
      "Paleolithic Diet",
      "Low-Fat",
      "Low-Carbohydrate",
      "South Beach Diet",
      "Dukan Diet",
      "Whole30",
      "Alkaline Diet",
      "Elimination Diet",
      "Pescetarianism",
      "Lacto-Vegetarian",
      "Carnivore Diet",
      "Mayo Clinic Diet",
      "Low Sodium Diet",
      "Flexitarian Diet",
      "Macrobiotic Diet",
      "Diabetic Diet",
    ],
    required: true,
  },
  goal: { type: String, required: true },
  description: { type: String, required: true },
});

const dietValidationSchema = Joi.object({
  title: Joi.string()
    .valid(
      "Ketogenic",
      "Mediterranean",
      "Gluten-Free",
      "Veganism",
      "Plant-Based",
      "Intermittent Fasting",
      "Raw Food",
      "Vegetarianism",
      "Paleolithic Diet",
      "Low-Fat",
      "Low-Carbohydrate",
      "South Beach Diet",
      "Dukan Diet",
      "Whole30",
      "Alkaline Diet",
      "Elimination Diet",
      "Pescetarianism",
      "Lacto-Vegetarian",
      "Carnivore Diet",
      "Mayo Clinic Diet",
      "Low Sodium Diet",
      "Flexitarian Diet",
      "Macrobiotic Diet",
      "Diabetic Diet"
    )
    .required(),
  goal: Joi.string().required(),
  description: Joi.string().required(),
});

const validateDiet = (diet) => dietValidationSchema.validate(diet);
const Diet = mongoose.model("Diet", dietSchema);

module.exports = { Diet, validateDiet };
