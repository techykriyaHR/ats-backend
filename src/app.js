const path = require("path");
const fs = require("fs");
const cors = require("cors");
const nodemailer = require("nodemailer");
require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./config/db");

const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Disable CORS protection from this react project origin
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

// Cron Jobs
const updateStatusCronJob = require("./controllers/cronjob/updateStatus");
updateStatusCronJob();

// auth
const loginRoutes = require('./routes/auth/loginRoutes');
const registerRoutes = require("./routes/auth/registerRoutes");
// applicant
const applicantRoutes = require('./routes/applicant/applicantRoutes');
const addApplicantRoutes = require('./routes/applicant/addApplicantRoutes');

// interview
const interviewRoutes = require('./routes/interview/interviewRoutes');

// company

//company
const positionRoutes = require('./routes/company/positionRoutes');

// analytic

// counter
const applicantCounterRoutes = require('./routes/counter/applicantCounterRoute');

// notification
const notificationRoutes = require("./routes/notification/notificationRoutes");

// user
const userRoutes = require('./routes/user/userRoutes');

// Routes
app.use('/applicants', applicantRoutes);
app.use('/applicants/add', addApplicantRoutes);
app.use('/counter', applicantCounterRoutes);
app.use('/interview', interviewRoutes);
app.use('/auth', loginRoutes);
app.use('/auth', registerRoutes);
app.use('/notification', notificationRoutes);
app.use('/user', userRoutes);
app.use('/company', positionRoutes);

const verifyToken = require("./middlewares/verifyToken");

app.get('/protected', verifyToken, (req, res) => {
    const { user_id, user_email } = req.user;
    console.log(user_id);
    console.log(user_email);
    
    res.json({ message: "okay" });
});

// Function for testing if connected to the database and call it when server starts
const testConnection = async () => {
    try {
        const results = await pool.query("SELECT * FROM ats_applicants");
        console.log("connected to database");
    } catch (error) {
        console.error(error.message);
    }
};

testConnection();

module.exports = app;