const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Coach = require("../../models/users/CoachModel");

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

  if (
    !firstName ||
    !lastName ||
    !username ||
    !email ||
    !password ||
    !age ||
    !phoneNumber ||
    !image
  ) {
    res.status(400);
    throw new Error("Please fill the missing feilds");
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

//generate jwt
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = { registerCoach, loginCoach };
