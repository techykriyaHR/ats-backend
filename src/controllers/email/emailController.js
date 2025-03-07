const pool = require("../../config/db");
const transporter = require("../../config/transporter");

const getApplicantInfo = async (applicant_id) => {
    const sql = `
            SELECT 
                a.applicant_id,
                a.first_name AS applicant_first_name,
                a.middle_name AS applicant_middle_name,
                a.last_name AS applicant_last_name,
                a.gender,
                a.birth_date,
                a.discovered_at,
                a.cv_link,
                c.mobile_number_1,
                c.mobile_number_2,
                c.email_1,
                c.email_2,
                c.email_3
            FROM ats_applicants a
            JOIN ats_contact_infos c ON a.contact_id = c.contact_id
            WHERE a.applicant_id = ?;
    `;

    const [results] = await pool.execute(sql, [applicant_id]);
    return results[0];
}

const getUserInfo = async (user_id) => {
    try {
        const sql = `
            SELECT
                a.*,
                i.*
            FROM hris_user_accounts a
            INNER JOIN hris_user_infos i ON a.user_id = i.user_id
            WHERE a.user_id = ?;
        `;
        const [results] = await pool.execute(sql, [user_id]);
        return results[0];
    } catch (error) {
        res.status(500).json({message: error.message});
    }

}


exports.emailApplicant = async (req, res) => {
    try {
        const { applicant_id, user_id, email_subject, email_body } = req.body;

        if (!applicant_id || !email_subject || !email_body) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const applicantData = getApplicantInfo(applicant_id);
        const userData = getUserInfo(user_id);

        const recipientEmails = [applicantData.email_1, applicantData.email_2, applicantData.email_3].filter(Boolean);

        // config of email message
        const mailOptions = {
            from: `"FullSuite" <${process.env.EMAIL_USER}>`,
            to: recipientEmails,
            subject: email_subject,
            html: email_body,
        };

        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Email sent successfully", info: info.response });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
