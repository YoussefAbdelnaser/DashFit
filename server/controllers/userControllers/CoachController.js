const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const {
  Coach,
  validateCoach,
  Subscription,
  validateSubscription,
  Plan,
  validatePlan,
  Workout,
  validateWorkout,
  Diet,
  validateDiet,
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
    throw new Error("Invalid email or password");
  }
});

//create a subscription
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

      const coach = await Coach.findById(id).populate("subscriptionsOffred");

      if (!coach) {
        return res.status(404).send({ message: "Coach not found" });
      }

      res.status(200).json(coach.subscriptionsOffred);
    }
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//delete subscription
//DELETE
//api/users/coach/delete-subscription/:id
const deleteSubscription = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    await Subscription.findByIdAndDelete(id);
    res.status(200).json({ message: "Subscription deleted successfuly" });
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//update subscription
//PUT
//api/users/coach/update-subscription/:id
const updateSubscription = asyncHandler(async (req, res) => {
  try {
    const { error } = validateSubscription(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const coach = await Coach.findById(req.user._id);
    if (!coach) {
      return res.status(404).send({ message: "Coach not found" });
    }

    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).send({ message: "Subscription not found" });
    }

    subscription.title = req.body.title;
    subscription.description = req.body.description;
    subscription.price = req.body.price;
    subscription.duration = req.body.duration;
    subscription.coach = coach._id;

    await subscription.save();
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//create plan
//POST
//api/users/coach/create-plan
const createPlan = asyncHandler(async (req, res) => {
  try {
    const { error } = validatePlan(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const coach = await Coach.findById(req.user._id);
    if (!coach) return res.status(404).send({ message: "Coach not found" });

    const subscription = await Subscription.findById(req.body.subscription);
    if (!subscription)
      return res.status(404).send({ message: "Subscription not found" });

    const plan = new Plan({
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      subscription: subscription._id,
    });

    await plan.save();

    subscription.plans.push(plan._id);

    await subscription.save();
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
  updateSubscription,
  createPlan,
};
