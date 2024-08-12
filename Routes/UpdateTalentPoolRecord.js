const express = require('express');
const { getTalentpoolCollection } = require('./dbconnection'); // Adjust the path if necessary

const UpdateTalentPoolRecord = express.Router().put("/:id", async (req, res) => {
    try {
        const collection = getTalentpoolCollection();
        const filter = { "UID": parseInt(req.params.id) };

        req.body["Last Updated Date"] = new Date();
        
        // Remove _id from the request body
        delete req.body._id;

        const updateData = { $set: req.body };
        const result = await collection.updateOne(filter, updateData);

        if (result.modifiedCount === 1) {
            res.status(200).send("Talent pool data updated successfully");
        } else {
            res.status(404).send("Talent pool record not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = UpdateTalentPoolRecord;
