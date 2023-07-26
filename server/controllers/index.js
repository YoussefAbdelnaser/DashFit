const {
  registerCoach,
  loginCoach,
  getAllSubscriptions,
  createSubscription,
  deleteSubscription,
} = require("./userControllers/CoachController");
const {
  registerTrainee,
  loginTrainee,
} = require("./userControllers/TraineeController");
const { login, signup } = require("./authController");

module.exports = {
  registerCoach,
  loginCoach,
  createSubscription,
  getAllSubscriptions,
  deleteSubscription,
  registerTrainee,
  loginTrainee,
  login,
  signup,
};
