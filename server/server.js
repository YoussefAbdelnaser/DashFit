require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db.js");
const traineeRoutes = require("./routes/userRoutes/TraineeRoutes.js");

const app = express();

connection();

app.use(cors());
app.use(express.json());

app.use("/api/trainee", traineeRoutes);

const port = process.env.PORT;

app.listen(port, console.log(`Server started on port ${port}`));
