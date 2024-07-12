const express = require('express');
const { getTalentpoolCollection } = require('./dbconnection')

const router = express.Router();

router.post("/", async (req, res) => {

    const { data } = req.body;

    console.log(`>>-------------->>>> | file: UploadTalent.js:10 | addTalentpool | data:`, data);


    if (!data || !Array.isArray(data)) {
        return res.status(400).send('Invalid data format');
    }

    try {
        const collection = getTalentpoolCollection();

        for (const record of data) {
            const { "UID": UID } = record;

            // Check if a record with the same Employee ID already exists in the database
            const existingRecord = await collection.findOne({ "UID": UID });

            if (existingRecord) {
                // If the record exists, update it
                await collection.updateOne({ "UID": UID }, { $set: record });
                console.log("Record updated:", record);
            } else {
                // If the record doesn't exist, insert a new record
                await collection.insertOne(record);
                console.log("Record inserted:", record);
            }
        }

        // console.log(`>>-------------->>>> | file: UploadTalent.js:20 | addTalentpool | collection:`, collection);

        // const result = await collection.insertMany(data);

        console.log(`>>-------------->>>> | file: UploadTalent.j/s:24 | addTalentpool | result:`, result);

        // console.log(`${result.insertedCount} documents were inserted`);
        // res.status(200).send({ message: 'Data inserted successfully' });
    } catch (error) {
        // console.error("Error inserting data:", error);
        // res.status(500).send('Internal Server Error');;
    }
    
});

router.get(`/`, async (req, res) => {
    try {
        const collection = getTalentpoolCollection();
        const data = await collection.find({}).toArray();
        res.status(200).json(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
      }
});

module.exports = router;