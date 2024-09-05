const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  solution: {
    type: [[Number]],
    required: true,
  },
  roundTimeStamp: {
    type: Date,
    default: Date.now,
  },
});

statisticsSchema.index({ solution: 1 }, { unique: true });


module.exports = mongoose.model('Statistics', statisticsSchema);
