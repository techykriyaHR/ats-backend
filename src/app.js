const path = require("path")
const fs = require("fs")
const cors = require("cors")
const dotenv = require('dotenv');
const pool = require("./config/db");

const updateStatusCronJob = require("./controllers/cronjob/updateStatus")

// import nodemailer from 'nodemailer';
const nodemailer = require("nodemailer")
dotenv.config();

const express = require('express')
const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Disable CORS protection from this react project origin
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))

// Transporter for email feature
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
    }
});

// Cron Jobs
updateStatusCronJob();

//auth

//applicant
const applicantRoutes = require('./routes/applicant/applicantRoutes');
const addApplicantRoutes = require('./routes/applicant/addApplicantRoutes')

//interview
const interviewRoutes = require('./routes/interview/interviewRoutes');
//company

//analytic

//counter
const applicantCounterRoutes = require('./routes/counter/applicantCounterRoute')


// Routes
app.use('/applicants', applicantRoutes);
app.use('/applicants/add', addApplicantRoutes);
app.use('/counter', applicantCounterRoutes);
app.use('/interview', interviewRoutes);



app.post("/send-email", async (req, res) => {
    try {
        var { to, subject, text } = req.body;
        text = text + `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/640px-Cat_August_2010-4.jpg">`;

        const mailOptions = {
            from: `"FullSuite" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
 
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email" });
    }
});

app.get("/test-quill", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})

app.get("/test-mysql", async (req, res) => {
    const [results, fields] = await pool.execute(
        'SELECT * FROM applicants'
      );

    res.status(200).json(results)
    
})

module.exports = app;