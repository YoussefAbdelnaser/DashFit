const { authorizeRole, authenticateUser } = require("./authMiddleware");

module.exports = { authenticateUser, authorizeRole };
