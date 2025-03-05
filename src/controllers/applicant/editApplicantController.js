const pool = require("../../config/db");

const editApplicant = async (applicant) => {
    try{
        //Update applicants
        sql = "UPDATE ats_applicants SET first_name = ?, middle_name = ?, last_name = ?, gender = ?, birth_date = ?, discovered_at = ?, cv_link = ? WHERE applicant_id = ?";
        values = [
            applicant.first_name,
            applicant.middle_name || null,
            applicant.last_name,
            applicant.gender,
            applicant.birth_date,
            applicant.discovered_at,
            applicant.cv_link || null,
            applicant.applicant_id,
        ]
        await pool.execute(sql, values);
        
        //Update contacts_info
        sql = "UPDATE ats_contact_infos SET mobile_number_1 = ?, mobile_number_2 = ?, email_1 = ?, email_2 = ?, email_3 = ? WHERE applicant_id = ?";
        values = [
            applicant.mobile_number_1 || null,
            applicant.mobile_number_2 || null,
            applicant.email_1,
            applicant.email_2 || null,
            applicant.email_3 || null,
            applicant.applicant_id,
        ]
        await pool.execute(sql, values);

        //Update position
        sql = "UPDATE ats_applicant_trackings SET  position_id = ? WHERE applicant_id = ?";
        values = [
            applicant.position_id,
            applicant.applicant_id,
        ]
        await pool.execute(sql, values);

        return true;
    } catch (error) {
        //console.error("Error editing applicant: ", error);
        console.log(error);
        return false;
    }
}

exports.editApplicant = async (req, res) => {
    const applicant = JSON.parse(req.body.applicant);

    const isSuccess = await editApplicant(applicant);
    if (isSuccess) {
        return res.status(201).json({ message: "successfully updated" })
    }
    res.status(500).json({ message: "failed to insert" })
}

