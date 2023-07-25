const jwt = require("jsonwebtoken");
const { Admin } = require("../models/users/AdminModel");
const { Coach } = require("../models/users/CoachModel");
const { Trainee } = require("../models/users/TraineeModel");

// Middleware function for role authorization
const authorizeRole = (allowedRoles) => (req, res, next) => {
  const token = req.header("Authorization");

  // Check if the token is present
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided." });
  }

  try {
    // Verify the token and get the payload data (including user role)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user role is allowed to access the endpoint
    if (!allowedRoles.includes(decoded.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden - Insufficient role." });
    }

    // If the user role is allowed, proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Invalid token
    return res.status(401).json({ message: "Unauthorized - Invalid token." });
  }
};

const authenticateUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check the user's role and find the corresponding user based on the role
      let user;
      switch (decoded.role) {
        case "Admin":
          user = await Admin.findById(decoded.id).select("-password");
          break;
        case "Coach":
          user = await Coach.findById(decoded.id).select("-password");
          break;
        case "Trainee":
          user = await Trainee.findById(decoded.id).select("-password");
          break;
        default:
          throw new Error("Invalid role.");
      }

      if (!user) {
        throw new Error("User not found.");
      }

      // Attach the user data to the request object
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

module.exports = { authorizeRole, authenticateUser };
