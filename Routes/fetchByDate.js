const express = require('express');
const { getCollection } = require('./dbconnection');

const fetchbydate = express.Router().get("/", async (req, res) => {
    try {
        const { fromDate, toDate } = req.query; // Get fromDate and toDate from query parameters
        console.log("____",fromDate);
        console.log("____",toDate);

        // Convert query parameters to integers if they are strings
        const fromDateInt = parseInt(fromDate, 10);
        const toDateInt = parseInt(toDate, 10);
        if (isNaN(fromDateInt) || isNaN(toDateInt)) {
            return res.status(400).send("Invalid date format");
        }

        const collection = getCollection();

        console.log(fromDateInt, toDateInt );

        // Find documents where 'Exit Date' is between fromDate and toDate
        const result = await collection.find({
            'Exit Date': { $gte: fromDateInt, $lte: toDateInt }
        }).toArray();

        res.send(result);
} catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = fetchbydate;