const pool = require("../../config/db");

exports.requisition = (req, res) => {
    res.json({ message: "okay" })
}

exports.source = async (req, res) => {
    try {
        const sql = `
        SELECT discovered_at AS source, COUNT(*) AS value
        FROM ats_applicants
        GROUP BY discovered_at
    `;

        const [results] = await pool.execute(sql);
        res.status(200).json({ message: "okay", source: results });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

