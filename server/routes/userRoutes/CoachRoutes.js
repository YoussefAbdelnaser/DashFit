const express = require("express");
const {
  registerCoach,
  loginCoach,
  getAllSubscriptions,
  createSubscription,
  deleteSubscription,
  updateSubscription,
  createPlan,
  getAllPlans,
  deletePlan,
  updatePlan,
  createWorkout,
  getAllWorkouts,
  deleteWorkout,
  updateWorkout,
  createWorkoutSpecifications,
  getAllWorkoutSpecifications,
  updateWorkoutSpecifications,
  createDiet,
  getDiet,
  updateDiet,
} = require("../../controllers");
const { authenticateUser, authorizeRole } = require("../../middlewares");

const router = express.Router();

//auth
router.post("/register", registerCoach);
router.post("/login", authenticateUser, authorizeRole(["Coach"]), loginCoach);

//subscription
router.post(
  "/:id/create-subscription",
  authenticateUser,
  authorizeRole(["Coach"]),
  createSubscription
);
router.get(
  "/:id/get-subscriptions",
  authenticateUser,
  authorizeRole(["Coach"]),
  getAllSubscriptions
);
router.delete(
  "/:id/delete-subscription",
  authenticateUser,
  authorizeRole(["Coach"]),
  deleteSubscription
);
router.put(
  "/:id/update-subscription",
  authenticateUser,
  authorizeRole(["Coach"]),
  updateSubscription
);

//plan
router.post(
  "/:id/create-plan",
  authenticateUser,
  authorizeRole(["Coach"]),
  createPlan
);
router.get(
  "/:id/get-plans",
  authenticateUser,
  authorizeRole(["Coach"]),
  getAllPlans
);
router.delete(
  "/:id/delete-plan",
  authenticateUser,
  authorizeRole(["Coach"]),
  deletePlan
);
router.put(
  "/:id/update-plan",
  authenticateUser,
  authorizeRole(["Coach"]),
  updatePlan
);

//workout
router.post("/:id/create-workout", createWorkout);
router.get("/:id/get-workouts", getAllWorkouts);
router.delete("/:id/delete-workout", deleteWorkout);
router.put("/:id/update-workout", updateWorkout);

//workout specifications
router.post("/:id/create-workout-specifications", createWorkoutSpecifications);
router.get("/:id/get-workout-specifications", getAllWorkoutSpecifications);
router.put("/:id/update-workout-specifications", updateWorkoutSpecifications);

//diet
router.post("/:id/create-diet", createDiet);
router.get("/:id/get-diet", getDiet);
router.put("/:id/update-diet", updateDiet);

module.exports = router;
