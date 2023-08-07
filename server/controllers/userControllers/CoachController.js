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
  WorkoutSpecifications,
  validateWorkoutSpecifications,
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

//change password
//PUT
//api/users/coach/:id/change-password
const changePassword = asyncHandler(async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).send({ message: "Coach id is required" });

    const coach = await Coach.findById(req.params.id);
    if (!coach) return res.status(404).send({ message: "Coach not found" });

    const { oldPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(oldPassword, coach.password);
    if (!isMatch) return res.status(400).send({ message: "Invalid password" });

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    coach.password = hashedPassword;
    await coach.save();

    res.status(200).json({ message: "Password changed successfuly" });
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//change email
//PUT
//api/users/coach/:id/change-email
const changeEmail = asyncHandler(async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).send({ message: "Coach id is required" });

    const coach = await Coach.findById(req.params.id);
    if (!coach) return res.status(404).send({ message: "Coach not found" });

    const { newEmail } = req.body;

    coach.email = newEmail;
    await coach.save();

    res.status(200).json({ message: "Email changed successfuly" });
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//get coach profile
//GET
//api/users/coach/:id/profile
const getCoachProfile = asyncHandler(async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) return res.status(404).send({ message: "Coach not found" });

    res.status(200).json(coach);
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//update coach profile other than password and email
//PUT
//api/users/coach/:id/update-profile
const updateCoachProfile = asyncHandler(async (req, res) => {
  try {
    const { error } = validateCoach(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const coach = await Coach.findById(req.params.id);
    if (!coach) return res.status(404).send({ message: "Coach not found" });

    coach.firstName = req.body.firstName;
    coach.lastName = req.body.lastName;
    coach.username = req.body.username;
    coach.age = req.body.age;
    coach.phoneNumber = req.body.phoneNumber;
    coach.image = req.body.image;

    await coach.save();
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
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
//api/users/coach/:id/create-plan
const createPlan = asyncHandler(async (req, res) => {
  try {
    const { error } = validatePlan(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const coach = await Coach.findById(req.user._id);
    if (!coach) return res.status(404).send({ message: "Coach not found" });

    if (!coach.subscriptionsOffred.includes(req.body.subscription))
      return res
        .status(404)
        .send({ message: "Subscription not offered by coach" });

    const subscription = await Subscription.findById(req.body.subscription);
    if (!subscription)
      return res.status(404).send({ message: "Subscription not found" });

    const plan = await Plan.findOne({ subscription: req.body.subscription });
    if (plan) {
      subscription.prevPlans.push(plan._id);
      subscription.currPlan.pull(plan._id);
      await subscription.save();
    }

    const newPlan = new Plan({
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      subscription: subscription._id,
    });

    await newPlan.save();
    subscription.currPlan.push(newPlan._id);
    await subscription.save();

    res.status(200).json(newPlan);
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//get plan
//GET
//api/users/coach/get-all-plans
const getAllPlans = asyncHandler(async (req, res) => {
  try {
    const plans = await Plan.find({ subscription: req.params.id }).populate(
      "subscription"
    );
    if (!plans) return res.status(404).send({ message: "Plan not found" });

    res.status(200).json(plans);
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//delete plan
//DELETE
//api/users/coach/delete-plan/:id
const deletePlan = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await Plan.findById(id);
    if (!plan) return res.status(404).send({ message: "Plan not found" });

    await Plan.findByIdAndDelete(id);
    res.status(200).json({ message: "Plan deleted successfuly" });
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//update plan
//PUT
//api/users/coach/update-plan/:id
const updatePlan = asyncHandler(async (req, res) => {
  try {
    const { error } = validatePlan(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const subscription = await Subscription.findById(req.body.subscription);
    if (!subscription) {
      return res.status(404).send({ message: "Subscription not found" });
    }

    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).send({ message: "Plan not found" });

    plan.title = req.body.title;
    plan.description = req.body.description;
    plan.startDate = req.body.startDate;
    plan.endDate = req.body.endDate;
    plan.subscription = subscription._id;

    await plan.save();
    subscription.plans.push(plan._id);
    await subscription.save();
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//create workout
//POST
//api/users/coach/:plan/create-workout
const createWorkout = asyncHandler(async (req, res) => {
  try {
    const { error } = validateWorkout(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).send({ message: "Plan not found" });

    const workout = new Workout({
      title: req.body.title,
      description: req.body.description,
      plan: plan._id,
    });

    plan.workout.push(workout._id);
    await plan.save();
    await workout.save();
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//get workout
//GET
//api/users/coach/get-all-workouts
const getAllWorkouts = asyncHandler(async (req, res) => {
  try {
    const workouts = await Workout.find({ plan: req.params.id }).populate(
      "plan"
    );
    if (!workouts)
      return res.status(404).send({ message: "Workout not found" });

    res.status(200).json(workouts);
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//get workout by id
//GET
//api/users/coach/get-workout/:id
const getWorkout = asyncHandler(async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).send({ message: "Workout not found" });

    res.status(200).json(workout);
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//delete workout
//DELETE
//api/users/coach/delete-workout/:id
const deleteWorkout = asyncHandler(async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).send({ message: "Plan not found" });

    const { id } = req.params;

    const workout = await Workout.findById(id);
    if (!workout) return res.status(404).send({ message: "Workout not found" });

    await Workout.findByIdAndDelete(id);
    plan.workout.pull(workout._id);
    await plan.save();
    res.status(200).json({ message: "Workout deleted successfuly" });
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//update workout
//PUT
//api/users/coach/update-workout/:id
const updateWorkout = asyncHandler(async (req, res) => {
  try {
    const { error } = validateWorkout(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).send({ message: "Plan not found" });

    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).send({ message: "Workout not found" });

    workout.title = req.body.title;
    workout.description = req.body.description;
    workout.plan = plan._id;
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//create workout specifications
//POST
//api/users/coach/:workout/create-workout-specifications
const createWorkoutSpecifications = asyncHandler(async (req, res) => {
  try {
    const { error } = validateWorkoutSpecifications(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).send({ message: "Workout not found" });

    const workoutSpecifications = new WorkoutSpecifications({
      title: req.body.title,
      sets: req.body.sets,
      repetitions: req.body.repetitions,
      description: req.body.description,
      image: req.body.image,
      workout: workout._id,
    });

    workout.workoutSpecifications.push(workoutSpecifications._id);
    await workout.save();
    await workoutSpecifications.save();
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//get workout specifications for a specific workout
//GET
//api/users/coach/get-all-workout-specifications
const getAllWorkoutSpecifications = asyncHandler(async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).send({ message: "Workout not found" });

    const workoutSpecifications = await WorkoutSpecifications.find({
      workout: workout._id,
    }).populate("workout");
    if (!workoutSpecifications)
      return res
        .status(404)
        .send({ message: "Workout specifications not found" });

    res.status(200).json(workoutSpecifications);
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//update workout specifications
//PUT
//api/users/coach/update-workout-specifications/:id
const updateWorkoutSpecifications = asyncHandler(async (req, res) => {
  try {
    const { error } = validateWorkoutSpecifications(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).send({ message: "Workout not found" });

    const workoutSpecifications = await WorkoutSpecifications.findById(
      req.params.id
    );
    if (!workoutSpecifications)
      return res
        .status(404)
        .send({ message: "Workout specifications not found" });

    workoutSpecifications.title = req.body.title;
    workoutSpecifications.sets = req.body.sets;
    workoutSpecifications.repetitions = req.body.repetitions;
    workoutSpecifications.description = req.body.description;
    workoutSpecifications.image = req.body.image;
    workoutSpecifications.workout = workout._id;

    await workoutSpecifications.save();
    workout.workoutSpecifications.push(workoutSpecifications._id);
    await workout.save();
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//create diet
//POST
//api/users/coach/:plan/create-diet
const createDiet = asyncHandler(async (req, res) => {
  try {
    const { error } = validateDiet(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).send({ message: "Plan not found" });

    const diet = new Diet({
      title: req.body.title,
      goal: req.body.goal,
      description: req.body.description,
      plan: plan._id,
    });

    plan.diet.push(diet._id);
    await plan.save();
    await diet.save();
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//get diet of a specific plan
//GET
//api/users/coach/get-diet/:id
const getDiet = asyncHandler(async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).send({ message: "Plan not found" });

    const diet = await Diet.findOne({ plan: plan._id }).populate("plan");
    if (!diet) return res.status(404).send({ message: "Diet not found" });

    res.status(200).json(diet);
  } catch (e) {
    res.status(400).send(`Something went wrong ${e.message}`);
  }
});

//update diet
//PUT
//api/users/coach/update-diet/:id
const updateDiet = asyncHandler(async (req, res) => {
  try {
    const { error } = validateDiet(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).send({ message: "Plan not found" });

    const diet = await Diet.findOne({ plan: plan._id });
    if (!diet) return res.status(404).send({ message: "Diet not found" });

    diet.title = req.body.title;
    diet.goal = req.body.goal;
    diet.description = req.body.description;
    diet.plan = plan._id;

    await diet.save();
    plan.diet.push(diet._id);
    await plan.save();
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
  changePassword,
  changeEmail,
  getCoachProfile,
  updateCoachProfile,
  createSubscription,
  getAllSubscriptions,
  deleteSubscription,
  updateSubscription,
  createPlan,
  getAllPlans,
  deletePlan,
  updatePlan,
  createWorkout,
  getAllWorkouts,
  getWorkout,
  deleteWorkout,
  updateWorkout,
  createWorkoutSpecifications,
  getAllWorkoutSpecifications,
  updateWorkoutSpecifications,
  createDiet,
  getDiet,
  updateDiet,
  createPlan,
};
