const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Trainee = require("../../models/users/TraineeModel");

//reg new trainee
//POST
// api/users/trainee/register
const registerTrainee = asyncHandler(async (req, res) => {
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
    !phoneNumber
  ) {
    res.status(400);
    throw new Error("Please fill the missing feilds");
  }

  //Check if trainee exists
  const traineeExists = await Trainee.findOne({ email });

  if (traineeExists) {
    res.status(400);
    throw new Error("User alrrady exists");
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create trainee
  const trainee = await Trainee.create({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    age,
    phoneNumber,
    image,
  });

  if (trainee) {
    res.status(201).json({ trainee, token: generateToken(trainee._id) });
  } else {
    res.status(400);
    throw new Error("inavlid data");
  }
});

//authenticate trainee
//POST
// api/users/trainee/login
const loginTrainee = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const trainee = await Trainee.findOne({ email });
  if (trainee && (await bcrypt.compare(password, trainee.password))) {
    res.json({ trainee, token: generateToken(trainee._id) });
  } else {
    res.status(404);
    throw new Error("Inavlid email or password");
  }
});

//generate jwt
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = { registerTrainee, loginTrainee, getAllTrainee };
