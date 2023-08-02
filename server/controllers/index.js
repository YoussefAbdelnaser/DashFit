const {
  registerCoach,
  loginCoach,
  getAllSubscriptions,
  createSubscription,
  deleteSubscription,
  updateSubscription,
  createPlan,
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
  updateSubscription,
  createPlan,
  registerTrainee,
  loginTrainee,
  login,
  signup,
};
