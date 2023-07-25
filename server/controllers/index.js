const {
  registerCoach,
  loginCoach,
} = require("./userControllers/CoachController");
const {
  registerTrainee,
  loginTrainee,
} = require("./userControllers/TraineeController");
const { login, signup } = require("./authController");

module.exports = {
  registerCoach,
  loginCoach,
  registerTrainee,
  loginTrainee,
  login,
  signup,
};
