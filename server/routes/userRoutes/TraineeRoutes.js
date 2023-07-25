const express = require("express");
const {
  registerTrainee,
  loginTrainee,
} = require("../../controllers/userControllers/TraineeController.js");

const {
  authenticateUser,
  authorizeRole,
} = require("../../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/register", registerTrainee);
router.post(
  "/login",
  authenticateUser,
  authorizeRole(["Trainee"]),
  loginTrainee
);

module.exports = router;
