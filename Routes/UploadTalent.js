const express = require('express');
const { getTalentpoolCollection } = require('./dbconnection')

const router = express.Router();

const addTalentpool = router.post("/", async (req, res) => {

    const { data } = req.body.data;

    if (!data || !Array.isArray(data)) {
        return res.status(400).send('Invalid data format');
    }

    try {
        const collection = getTalentpoolCollection();
        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount} documents were inserted`);
        res.status(200).send({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).send('Internal Server Error');;
    }
    
});

module.exports = addTalentpool;