const express = require('express');
const { getTalentpoolCollection } = require('../Routes/dbconnection');

const router = express.Router();

router.get('/bands', async (req, res) => {
    try {
        const collection = getTalentpoolCollection('talentpoolDetails'); // Specify the collection name
        const bands = await collection.distinct('Band');
        res.status(200).json(bands);
    } catch (error) {
        console.error('Error fetching band data:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
