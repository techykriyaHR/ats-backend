const pool = require("../../config/db");

exports.getPositions = async (req, res) => {
    //return list of positions
    try {
        const sql = `
        SELECT * 
        FROM sl_company_jobs
    `;

    const [results] = await pool.execute(sql);
    res.status(200).json({message: "positions retrieved", positions: results})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}