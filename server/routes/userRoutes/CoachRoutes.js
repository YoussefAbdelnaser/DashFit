const express = require("express");
const {
  registerCoach,
  loginCoach,
} = require("../../controllers/userControllers/CoachController");
const { protectCoach } = require("../../middlewares/coachAuthMiddleware");

const router = express.Router();

router.post("/register", registerCoach);
router.post("/login", loginCoach);

module.exports = router;
