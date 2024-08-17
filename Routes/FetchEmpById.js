const express = require('express');
const { getCollection } = require('./dbconnection');

const fetch = express.Router().get("/:id", async (req, res) => {
    try {
        const collection = getCollection();
        const employeeID = isNaN(req.params.id) ? req.params.id : parseInt(req.params.id)
        const result = await collection.find({"Employee ID" : employeeID}).toArray();
        console.log("********", req.params.id)
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = fetch;
