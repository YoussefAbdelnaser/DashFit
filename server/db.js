const mongoose = require("mongoose");

module.exports = async () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(process.env.DB, connectionParams);
    console.log("Connected to Mongo succefully");
  } catch (error) {
    console.log("could not connect to database.", error);
  }
};
