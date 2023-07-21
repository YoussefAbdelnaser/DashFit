const express = require("express");
const {
  registerTrainee,
  loginTrainee,
  getAllTrainee,
} = require("../../controllers/userControllers/TraineeController.js");
const { protect } = require("../../middlewares/traineeAuthMiddleware.js");

const router = express.Router();

router.post("/register", registerTrainee);
router.post("/login", loginTrainee);

module.exports = router;
