const pool = require("../../config/db");
const transporter = require("../../config/transporter");

exports.emailApplicant = async (req, res) => {
    try {
        const { applicant_id, email_subject, email_body } = req.body;

        if (!applicant_id || !email_subject || !email_body) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        //  applicant info and interviewer details
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
        console.log(results);
        
        if (!results.length) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        
        const applicantData = results[0];

        const recipientEmails = [applicantData.email_1, applicantData.email_2, applicantData.email_3].filter(Boolean);

        if (!recipientEmails.length) {
            return res.status(400).json({ message: "No valid recipient emails found" });
        }

        // config of email message
        const mailOptions = {
            from: `"FullSuite" <${process.env.EMAIL_USER}>`,
            to: recipientEmails,
            subject: email_subject,
            html: email_body,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);

        res.status(200).json({ message: "Email sent successfully", info: info.response });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
