const express = require('express');
const { getCollection } = require('./dbconnection');

const UpdateRecord = express.Router().put("/:id", async (req, res) => {
    try {
        const collection = getCollection();
        const employeeID = isNaN(req.params.id) ? req.params.id : parseInt(req.params.id)
        const filter = { "Employee ID": employeeID };
        req.body["Last Updated Date"] = new Date;
        const updateData = { $set: req.body }; // Assuming req.body contains the update data
        console.log("Update data", req.params.id, updateData)
        delete updateData._id; // Exclude _id field from update
        const result = await collection.updateOne(filter, updateData);

        if (result.modifiedCount === 1) {
            res.status(200).send("Employee data updated successfully");
        } else {
            res.status(404).send("Employee not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = UpdateRecord;