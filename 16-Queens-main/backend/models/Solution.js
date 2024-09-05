const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  solution: {
    type: [[Number]],
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Solution', solutionSchema);
