const pool = require("../../config/db");

const updateStatus = async (progress_id, status) => {

    converted_status = status.toUpperCase().replace(/ /g, "_")

    // get the corresponding stage based on status. 
    let stage = updateStage(converted_status)

    try {
        //update status of applicant
        let sql = "UPDATE ats_applicant_progress SET stage =?, status = ? WHERE progress_id = ?"
        let values = [
            stage,
            converted_status,
            progress_id
        ];
      
        await pool.execute(sql, values);
        
        return true
    } catch (error) {
        console.log("Error updating status of applicant")
        return false
    }
}

const updateStage = (status) => {
    let pre_screening = "TEST_SENT";
    let interview_schedule = ["INTERVIEW_SCHEDULE_SENT", "FIRST_INTERVIEW", "SECOND_INTERVIEW", "THIRD_INTERVIEW", "FOURTH_INTERVIEW", "FOLLOW_UP_INTERVIEW"];
    let job_offer = ["FOR_JOB_OFFER", "JOB_OFFER_REJECTED", "JOB_OFFER_ACCEPTED"];
    let unsuccessful =["WITHDREW_APPLICATION", "BLACKLISTED", "NOT_FIT"];

    if (status == pre_screening) {
        return "PRE_SCREENING";
    }
    else if (interview_schedule.includes(status)) {
        return "INTERVIEW_SCHEDULE";
    }
    else if (job_offer.includes(status)) {
        return "JOB_OFFER";
    }
    else if (unsuccessful.includes(status)) {
        return "UNSUCCESSFUL";
    }
    else {
        console.log(status + " not in the stage")
    }
}

exports.updateApplicantStatus = async (req, res) => {
    const {progress_id, status } = req.body;

    const isSuccess = await updateStatus(progress_id, status);
    if (isSuccess) {
        return res.status(201).json({ message: "successfully updated status of applicant"})
    }
    res.status(500).json({ message: "failed to update status of applicant"})
}