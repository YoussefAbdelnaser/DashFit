const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/users/AdminModel");
const Coach = require("../models/users/CoachModel");
const Trainee = require("../models/users/TraineeModel");

const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
  return token;
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists based on the email
    const user = await Admin.findOne({ email }).select("+password").exec();
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid email or password.");
    }

    // Generate a token and send it as a response
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const signup = async (req, res) => {
  const { role, ...userData } = req.body;

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create a new user based on the role
    let user;
    switch (role) {
      case "Admin":
        user = await Admin.create({ ...userData, password: hashedPassword });
        break;
      case "Coach":
        user = await Coach.create({ ...userData, password: hashedPassword });
        break;
      case "Trainee":
        user = await Trainee.create({ ...userData, password: hashedPassword });
        break;
      default:
        throw new Error("Invalid role.");
    }

    // Generate a token and send it as a response
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { login, signup };
