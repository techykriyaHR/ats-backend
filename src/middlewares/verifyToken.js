const path = require("path")
const fs = require("fs")
const cors = require("cors")
const nodemailer = require("nodemailer")
require('dotenv').config();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const pool = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({message: "Access Denied"});

    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({message: "Invalid token"});

        req.user = decoded;
        next();
    })
}

module.exports = verifyToken;
