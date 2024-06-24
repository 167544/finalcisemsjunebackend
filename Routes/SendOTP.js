// Import required modules
const express = require('express');
const nodemailer = require('nodemailer');
const { getDB } = require('./dbconnection');
const { verifyIfManager } = require('../controllers/user');

// Create an instance of Express router
const router = express.Router();

// Dummy database to store OTPs (For demonstration purpose only)
const otpDatabase = {};

// Generate OTP function
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
}

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ust.cis.ems@gmail.com', // Enter your Gmail email address
        pass: 'urpt tvap lhha febw' // Enter your Gmail password
    }
});

// Define the route for sending OTP
router.post('/', async (req, res) => {
    const db = getDB()
    let { email, employeeId, isAdmin } = req.body;
    if (!email || !employeeId) {
        return res.status(400).json({ message: 'Email address and employee id is required' });
    }
    console.log('^^^^^^^^^^^^^^^^^^',employeeId,email)
    employeeId = !isNaN(employeeId) ? Number(employeeId) : employeeId
    const query =  { "Employee ID": employeeId, "Employee Email": email }
    const employee = await db.collection("employeeDetails").findOne(query);
    console.log('1111testing otp failed ######', query,employee)
    console.log('2222testing otp failed ######', employee);
    if (!employee) {
        return res.status(400).json({ message: "Employee details not found" });
    }

    const otp = generateOTP();
    otpDatabase[email] = otp;

    let emailSubject = `Your OTP to create account with CIS UST`;
    let emailBody = `Your OTP to create account with CIS UST is ${ otp }`;
    let apiResponseMessage = 'OTP sent successfully'

    let isManager = verifyIfManager(email);
    console.log({ isAdmin, isManager })

    if (isAdmin && !isManager) {
        return res.status(400).json({ message: "Only managers can register as admin. Try registering as a user!" });
    }

    if (!isAdmin && isManager) {
        return res.status(400).json({ message: "You are a Manager. Kindly create an Admin account!" });
    }

    if (isAdmin) {
        emailSubject = `OTP for ${ employee["Employee Name"] } to create account with CIS UST`;
        emailBody = `${ employee["Employee Name"]} has initiated an account creation with CIS UST as an Admin User. The OTP is ${ otp }.\nKindly share this OTP with them to finish their account creation.`
        apiResponseMessage = `OTP has been shared with your manager - ${ employee["1st Manager"] }. Kindly get in touch with them to get the OTP to complete your account creation` 
    }

    let emailOfFirstManagerOfAdminEmployee = employee["1st Manager Email ID"];
    console.log(`Sending otp ${ otp } to reporting manager of ${ employee["Employee Name"] }`, emailOfFirstManagerOfAdminEmployee)
    let toAddress = `nehamary.baby@ust.com, ${ emailOfFirstManagerOfAdminEmployee }`

    // Send OTP via email
    const mailOptions = {
        from: 'CIS-Hiring@ust.com', // Sender email address
        //to: emailOfFirstManagerOfAdminEmployee,
        // to: 'nehamary.baby@ust.com, vipin.kumarnair@ust.com', //change your email
        subject: emailSubject,
        text: emailBody
    };
    
        console.log("mailOptions", mailOptions)
    try {
        transporter.sendMail(mailOptions);
        res.status(200).json({ message: apiResponseMessage });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
});


router.post('/verifyotp', (req, res) => {
    const { email, otp } = req.body;
    const storedOTP = otpDatabase[email];

    if (storedOTP && storedOTP.toString() === otp) {
        // OTP is valid
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        // Invalid OTP
        res.status(400).json({ message: 'Invalid OTP' });
    }
});
// Export the router
module.exports = router;