const express = require('express');
const router = express.Router();
const Solution = require('../models/Solution');
const Statistics = require('../models/Statistics');
const { checkSolution } = require('../utils/queenCheck');

router.post('/check', async (req, res) => {
    const { board, userName } = req.body;

    console.log('Received board:', board); 

    try {
        if (!Array.isArray(board) || board.length !== 16 || !board.every(row => Array.isArray(row) && row.length === 16 && row.every(cell => cell === 0 || cell === 1))) {
            return res.status(400).json({ message: 'Invalid solution format.' });
        }

        const existsInStatistics = await Statistics.findOne({ solution: board });

        if (existsInStatistics) {
            try {
                await Solution.create({ solution: board, userName });
                res.json({ message: 'Valid solution! Storing your solution.' });
            } catch (error) {
                if (error.code === 11000) {
                    res.json({ message: 'Solution already submitted.' });
                } else {
                    console.error('Error saving solution:', error);
                    res.status(500).json({ message: 'An error occurred while saving the solution.' });
                }
            }
        } else {
            const isValid = checkSolution(board);

            if (isValid) {
                try {
                    await Solution.create({ solution: board, userName });
                    res.json({ message: 'Valid solution! Storing your solution.' });
                } catch (error) {
                    if (error.code === 11000) {
                        res.json({ message: 'Solution already submitted.' });
                    } else {
                        console.error('Error saving solution:', error);
                        res.status(500).json({ message: 'An error occurred while saving the solution.' });
                    }
                }
            } else {
                res.json({ message: 'Invalid solution. Please try again.' });
            }
        }
    } catch (error) {
        console.error('Error checking solution:', error);
        res.status(500).json({ message: 'An error occurred while checking the solution.' });
    }
});

module.exports = router;
