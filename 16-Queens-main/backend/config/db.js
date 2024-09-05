const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://adnaanjanees0:cK40LtP3g3oywKjq@cluster0.1s0ub.mongodb.net/queens-game', {
      useUnifiedTopology: true,
    });
    console.log('Database Successfully Connected!');
  } catch (err) {
    console.error('Failed to connect to Database!', err);
    process.exit(1);
  }
};

module.exports = connectDB;
