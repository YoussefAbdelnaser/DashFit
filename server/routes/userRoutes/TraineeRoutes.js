const express = require("express");

const { registerTrainee, loginTrainee } = require("../../controllers");
const { authenticateUser, authorizeRole } = require("../../middlewares");

const router = express.Router();

router.post("/register", registerTrainee);
router.post(
  "/login",
  authenticateUser,
  authorizeRole(["Trainee"]),
  loginTrainee
);

module.exports = router;
