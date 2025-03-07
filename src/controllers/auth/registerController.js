const cors = require("cors")
const nodemailer = require("nodemailer")
require('dotenv').config();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const pool = require("../../config/db")
const { v4: uuidv4 } = require("uuid");

exports.register = async (req, res) => {
    try {
        const {user_email, user_password} = req.body;
        const user_id = uuidv4();
        const hashedPassword = await bcrypt.hash(user_password, 10);

      


        // const user_key = "123";

    
         const user_key = Math.random().toString(36).slice(-8);
    
        const sql = `
            INSERT INTO hris_user_accounts (user_id, user_email, user_password, user_key, created_at)
            VALUES (?, ?, ?, ?, NOW())
        `;
        const values = [user_id, user_email, hashedPassword, user_key];
        
       await pool.execute(sql, values);
       res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }

}