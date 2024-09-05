const express = require('express');
const connectDB = require('./config/db');
const generate16QueensSolutions = require('./utils/queenAlgorithm');
const Statistics = require('./models/Statistics');
const cors = require('cors');
const { checkSolution } = require('./utils/queenCheck');

const app = express();
const PORT = 5000;

console.log('Starting server...');

const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connected successfully.');

    app.use(cors());
    app.use(express.json());

    const solutionRoutes = require('./routes/solutionRoutes');
    app.use('/api/solutions', solutionRoutes);

    const initializeDatabaseWithSolutions = async () => {
      try {
        console.log('Initializing database with 16-queens solutions...');
        const startTime = Date.now();
        
        const solutions = generate16QueensSolutions(1000);
        console.log(`Generated ${solutions.length} solutions.`);
        
        for (const solution of solutions) {
          try {
            await Statistics.updateOne({ solution }, { solution }, { upsert: true });
          } catch (insertError) {
            console.error('Error upserting solution:', insertError);
          }
        }
        
        console.log(`Stored solutions in ${Date.now() - startTime} ms`);
      } catch (error) {
        console.error('Error initializing solutions:', error);
      }
    };
    
    await initializeDatabaseWithSolutions();
    console.log('Database initialization complete.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); 
  }
};

startServer();

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1); 
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1); 
});
