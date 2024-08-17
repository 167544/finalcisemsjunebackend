const express = require('express');
const { getTalentpoolCollection } = require('./dbconnection'); // Adjust the path if necessary

const fetchTalentPool = express.Router();

fetchTalentPool.get('/:id', async (req, res) => {
    try {
        const collection = getTalentpoolCollection();
        const uid = parseInt(req.params.id);  // Convert UID to an integer
        const result = await collection.find({ UID: uid }).toArray();

        if (result.length > 0) {
            res.status(200).send(result);
        } else {
            res.status(404).send('Talent pool record not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// In your FetchTalentPool.js or equivalent file
fetchTalentPool.get('/', async (req, res) => {
    try {
        const collection = getTalentpoolCollection();
        const result = await collection.find({}).toArray();  // Fetch all records
        res.status(200).send(result);
    } catch (err) {
        console.error('Error fetching all talent pool records:', err);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = fetchTalentPool;