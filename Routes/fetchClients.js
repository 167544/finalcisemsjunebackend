const express = require('express');
const router = express.Router();
const { getCollection } = require('../Routes/dbconnection'); // Adjust the path if necessary

// Fetch all clients from the database
router.get('/clients', async (req, res) => {
  try {
    const collection = getCollection(); // Assume your clients are stored in the same collection as employees
    const clients = await collection.distinct('Client'); // Use distinct to get unique client names
    res.json(clients); // Send the unique clients as the response
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
