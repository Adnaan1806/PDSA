const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://adnaanjanees0:cK40LtP3g3oywKjq@cluster0.1s0ub.mongodb.net/",
  {}
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Create a Schema and Model for Player Data
const playerSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  timeTaken: { type: Number, required: true },
  moveCount: { type: Number, required: true },
});

const Player = mongoose.model("Player", playerSchema);

// API route to save player data
app.post("/savePlayerData", async (req, res) => {
  try {
    const { playerName, timeTaken, moveCount } = req.body;

    console.log("Received data:", { playerName, timeTaken, moveCount });

    const player = new Player({ playerName, timeTaken, moveCount });

    await player.save(); // Await the save operation

    res.status(200).send("Player data saved successfully");
  } catch (err) {
    console.error("Error saving player data:", err);
    res.status(500).send("Error saving player data");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
