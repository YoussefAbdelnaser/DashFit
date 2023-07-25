const express = require("express");
const {
  registerCoach,
  loginCoach,
} = require("../../controllers/userControllers/CoachController");
const {
  authenticateUser,
  authorizeRole,
} = require("../../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/register", registerCoach);
router.post("/login", authenticateUser, authorizeRole(["Coach"]), loginCoach);

module.exports = router;
