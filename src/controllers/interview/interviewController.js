const pool = require("../../config/db");
const { v4: uuidv4 } = require("uuid");

// /interview - post
exports.addInterview = async (req, res) => {
    try {
        const interview = req.body;
        const interview_id = uuidv4();
        const note_id = uuidv4();

        let sql = `INSERT INTO ats_applicant_interviews (interview_id, tracking_id, interviewer_id, date_of_interview)
                     VALUES (?, ?, ?, ?)`;
        let values = [interview_id, interview.tracking_id, interview.interviewer_id, interview.date_of_interview];
        await pool.execute(sql, values);

        
        sql = `
            INSERT INTO ats_interviews_notes (note_id, interview_id, note_type)
            VALUES (?, ?, ?)
        `;
        values = [note_id, interview_id, interview.note_type];
        await pool.execute(sql, values);

        res.status(201).json({ message: "interview added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
}

exports.getInterview = async (req, res) => {
    try {
        const interview = req.query;
    
        const sql = `
            SELECT DISTINCT 
                ai.interview_id,
                ai.tracking_id,
                ai.date_of_interview,
                ai.created_at AS interview_created_at,

                u.user_id AS interviewer_id,
                u.first_name AS interviewer_first_name,
                u.middle_name AS interviewer_middle_name,
                u.last_name AS interviewer_last_name,
                u.personal_email AS interviewer_email,
                u.contact_number AS interviewer_contact,

                ua.user_email AS interviewer_account_email,
                ua.is_deactivated AS interviewer_status,

                n.note_id,
                n.note_type,
                n.note_body,
                n.noted_at
            FROM ats_applicant_interviews ai
            LEFT JOIN ats_interviews_notes n ON ai.interview_id = n.interview_id
            LEFT JOIN hris_user_infos u ON ai.interviewer_id = u.user_id
            LEFT JOIN hris_user_accounts ua ON u.user_id = ua.user_id
            WHERE ai.tracking_id = ?
        `;
        const values = [interview.tracking_id];

        const [results] = await pool.execute(sql, values);

        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.addNote = async (req, res) => {
    try {
        const interview = req.body;

        const sql = `
            UPDATE ats_interviews_notes (note_body) 
            VALUES (?)
            WHERE note_id = ?
        `;
        const values = [interview.note_body, interview.note_id];
        await pool.execute(sql, values);

        res.status(201).json({ message: "interview added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }

}