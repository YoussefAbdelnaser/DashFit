const express = require("express");
const {
  registerCoach,
  loginCoach,
  getAllSubscriptions,
  createSubscription,
  deleteSubscription,
} = require("../../controllers");
const { authenticateUser, authorizeRole } = require("../../middlewares");

const router = express.Router();

router.post("/register", registerCoach);
router.post("/login", authenticateUser, authorizeRole(["Coach"]), loginCoach);
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

module.exports = router;
