const { Admin, validateAdmin } = require("./users/AdminModel");
const { Coach, validateCoach } = require("./users/CoachModel");
const { Trainee, validateTrainee } = require("./users/TraineeModel");
const { Plan, validatePlan } = require("./PlanModel");
const { Subscription, validateSubscription } = require("./SubscriptionModel");
const { Workout, validateWorkout } = require("./WorkoutModel");
const {
  WorkoutSpecifications,
  validateWorkoutSpecifications,
} = require("./WorkoutSpecifications");

module.exports = {
  Admin,
  validateAdmin,
  Coach,
  validateCoach,
  Trainee,
  validateTrainee,
  Plan,
  validatePlan,
  Subscription,
  validateSubscription,
  Workout,
  validateWorkout,
  WorkoutSpecifications,
  validateWorkoutSpecifications,
};
