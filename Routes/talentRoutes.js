const express = require('express');
const { getTalentpoolCollection } = require('./dbconnection'); // Ensure this path is correct

const router = express.Router();

// Route to fetch an employee's details by ID from the talent pool
router.get('/details/:id', async (req, res) => {
    try {
        const talentPoolCollection = getTalentpoolCollection();
        const employeeId = parseInt(req.params.id, 10); // Convert ID to an integer if necessary
        const employee = await talentPoolCollection.findOne({ "UID": employeeId });

        if (!employee) {
            return res.status(404).send('Employee not found');
        }

        res.json(employee);
    } catch (err) {
        console.error('Error fetching employee details:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
