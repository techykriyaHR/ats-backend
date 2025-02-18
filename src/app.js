const path = require("path")
const fs = require("fs")
const dotenv = require('dotenv');

dotenv.config();

const express = require('express')
const app = express()

//do we have to se method-overrite middleware? what are alternatives
//think about it. if we're going to use js to communicate with the backend, 
//we're not restricted to the methods of HTML. 
// const methodOverride = require("method-override")
// app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
 
//applicant
const applicantRoutes = require('./routes/applicantRoutes');

//interview


//company
const positionRoutes = require("./routes/company/positionRoutes")
const userRoutes = require("./routes/company/userRoutes")



app.use('/applicants', applicantRoutes);

app.get('/', (req, res) => res.send('Hello World!'))

module.exports = app;
