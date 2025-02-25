const path = require("path")
const fs = require("fs")
const cors = require("cors")
const dotenv = require('dotenv');
const pool = require("./config/db");
// import nodemailer from 'nodemailer';
const nodemailer = require("nodemailer")
dotenv.config();

const express = require('express')
const app = express()

//do we have to se method-overrite middleware? what are alternatives
//think about it. if we're going to use js to communicate with the backend, 
//we're not restricted to the methods of HTML. 
// const methodOverride = require("method-override")
// app.use(methodOverride('_method'))

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
        pass: process.env.EMAIL_PASS
    }
})

//auth

//applicant
const applicantRoutes = require('./routes/applicant/applicantRoutes');

//interview

//company

//analytic


// Routes
app.use('/applicants', applicantRoutes);



// Test endpoint
app.get('/', (req, res) => res.send('Hello World!'))

app.get("/test-api", (req, res) => {

    pool.query('SELECT * FROM users', function (err, results, fields) {
        if (err) throw err;
        console.log(results);
    });

    res.json({ message: "backend is working..." })
})

app.post("/send-email", async (req, res) => {
    try {
        const { to, subject, text } = req.body;

        const mailOptions = {
            from: `"FullSuite" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: "<h1>sample</h1><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/640px-Cat_August_2010-4.jpg'>",
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);

        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email" });
    }
});

module.exports = app;
