const express = require('express');
const { getTalentpoolCollection } = require('./dbconnection'); // Adjust the path if necessary

const fetchTalentPool = express.Router().get("/:id", async (req, res) => {
    try {
        const collection = getTalentpoolCollection();
        const result = await collection.find({ "UID": parseInt(req.params.id) }).toArray();
        if (result.length > 0) {
            res.status(200).send(result);
        } else {
            res.status(404).send("Talent pool record not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = fetchTalentPool;
