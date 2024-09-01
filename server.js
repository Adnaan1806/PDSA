const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 4001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://adnaanjanees0:cK40LtP3g3oywKjq@cluster0.1s0ub.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define a schema and model
const responseSchema = new mongoose.Schema({
  name: String,
  value: Number,
  index: Number,
});

const Response = mongoose.model("Response", responseSchema);

// API endpoint to save response
app.post("/saveResponse", async (req, res) => {
  const { name, value, index } = req.body;
  try {
    const newResponse = new Response({ name, value, index });
    await newResponse.save();
    res.status(200).send("Response saved successfully!");
  } catch (error) {
    res.status(500).send("Error saving response");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
