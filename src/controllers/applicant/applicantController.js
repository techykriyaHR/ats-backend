const pool = require("../../config/db");

exports.getAllApplicants = (req, res) => {

    const sql = "SELECT * FROM ats_applicants";


    pool.execute(sql, (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json(result)
    })
}

exports.getApplicantsFilter = (req, res) => {
    const filter = req.body;

    //filter logic. Extract the keys in the filter object which represents the filter option
}

exports.getApplicant = (req, res) => {

    res.json({sample: "cats", sample2: "dogs"})
}
