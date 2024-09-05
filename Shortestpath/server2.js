const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://adnaanjanees0:cK40LtP3g3oywKjq@cluster0.1s0ub.mongodb.net/",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Result Schema
const resultSchema = new mongoose.Schema({
  name: String,
  startCity: String,
  endCity: String,
  correctDistance: Number,
  timeTaken: Number,
  date: { type: Date, default: Date.now },
});

const Result = mongoose.model("Result", resultSchema);

// Save Result
app.post("/save-result", async (req, res) => {
  const { name, startCity, endCity, correctDistance, timeTaken } = req.body;

  try {
    const newResult = new Result({
      name,
      startCity,
      endCity,
      correctDistance,
      timeTaken,
    });
    await newResult.save();
    res.status(201).send("Result saved successfully!");
  } catch (error) {
    res.status(500).send("Error saving result");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

<script src="path.js"></script>;
