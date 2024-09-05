// server.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://adnaanjanees0:cK40LtP3g3oywKjq@cluster0.1s0ub.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const resultSchema = new mongoose.Schema({
  cost: Number,
  time: Number,
  date: { type: Date, default: Date.now },
});

const Result = mongoose.model("Result", resultSchema);

app.post("/saveResult", (req, res) => {
  const newResult = new Result({
    cost: req.body.cost,
    time: req.body.time,
  });

  newResult
    .save()
    .then((result) => res.json(result))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.listen(3001, () => {
  console.log("Server is running on port 3000");
});
