const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const {
  Coach,
  validateCoach,
  Subscription,
  validateSubscription,
} = require("../../models");

//reg new coach
//POST
// api/users/coach/register
const registerCoach = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    age,
    phoneNumber,
    image,
  } = req.body;

  // Validate coach data
  const { error } = validateCoach(req.body);

  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  //Check if coach exists
  const coachExists = await Coach.findOne({ email });

  if (coachExists) {
    res.status(400);
    throw new Error("User alrrady exists");
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create coach
  const coach = await Coach.create({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    age,
    phoneNumber,
    image,
  });

  if (coach) {
    res.status(201).json({ coach, token: generateToken(coach._id) });
  } else {
    res.status(400);
    throw new Error("inavlid data");
  }
});

//authenticate coach
//POST
// api/users/coach/login
const loginCoach = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const coach = await Coach.findOne({ email });
  if (coach && (await bcrypt.compare(password, coach.password))) {
    res.json({ coach, token: generateToken(coach._id) });
  } else {
    res.status(404);
    throw new Error("Inavlid email or password");
  }
});

//create a subscription plan
//POST
//api/users/coach/create-subscription
const createSubscription = asyncHandler(async (req, res) => {
  try {
    const { error } = validateSubscription(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const coach = await Coach.findById(req.user._id);
    if (!coach) return res.status(404).send({ message: "Coach not found" });

    const subscription = new Subscription({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      duration: req.body.duration,
      coach: coach._id,
      trainees: req.body.trainees,
      prevPlans: req.body.prevPlans,
      currPlan: req.body.currPlan,
    });

    await subscription.save();
    coach.subscriptionsOffred.push(subscription._id);
    await coach.save();
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//get subscription
//GET
//api/users/coach/get-all-subscriptions
const getAllSubscriptions = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() !== id) {
      res.status(403).send({
        message:
          "Access denied , can only get subscriptions associated to this user",
      });

      const coach = await Coach.findById(id).populate("subscriptionsOffered");

      if (!coach) {
        return res.status(404).send({ message: "Coach not found" });
      }

      res.status(200).json(coach.subscriptionsOffred);
    }
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

const deleteSubscription = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    await Subscription.findByIdAndDelete();
    res.status(200).json({ message: "Subscription deleted successfuly" });
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});
//generate jwt
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  registerCoach,
  loginCoach,
  createSubscription,
  getAllSubscriptions,
  deleteSubscription,
};
