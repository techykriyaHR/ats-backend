const path = require("path")
const fs = require("fs")
const cors = require("cors")
const dotenv = require('dotenv');
const pool = require("./config/db");

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

//auth

//applicant
const applicantRoutes = require('./routes/applicant/applicantRoutes');

//interview

//company

//analytic


// Routes
app.use('/applicants', applicantRoutes);

app.get('/', (req, res) => res.send('Hello World!'))

app.get("/test-api", (req, res) => {

    pool.query('SELECT * FROM users', function (err, results, fields) {
        if (err) throw err;
        console.log(results);
    });

    res.json({ message: "backend is working..." })
})

module.exports = app;
