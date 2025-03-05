//const pool =  require("../../config/db")
var mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'localdb',
    waitForConnections: 10,
    connectionLimit: 10,
    port: 8889,
    queueLimit: 0
});


exports.getApplicantCount =  async (req, res) => {
    const positionFilter = req.query.position || "";
    const counter = {
        "Test Sent": 0, "Interview Schedule Sent": 0, "First Interview Stage": 0, "Second Interview Stage": 0,
        "Third Interview Stage": 0, "Fourth Interview Stage": 0, "Follow-up Interview Stage": 0, 
        "For Job Offer": 0, "Job Offer Rejected": 0, "Job Offer Accepted": 0, "Withdrew Application": 0, 
        "Blacklisted/Short-banned": 0, "Not Fit": 0, "Pre-Screening Stage": 0, "Interview Schedule Stage": 0, 
        "Job Offer Stage": 0, "Unsuccessful Stage/Pool": 0
    };

    const stageMapping = {
        "TEST_SENT": "Test Sent", "INTERVIEW_SCHEDULE_SENT": "Interview Schedule Sent", 
        "FIRST_INTERVIEW": "First Interview Stage", "SECOND_INTERVIEW": "Second Interview Stage",
        "THIRD_INTERVIEW": "Third Interview Stage", "FOURTH_INTERVIEW": "Fourth Interview Stage",
        "FOLLOW_UP_INTERVIEW": "Follow-up Interview Stage", "FOR_JOB_OFFER": "For Job Offer",
        "JOB_OFFER_REJECTED": "Job Offer Rejected", "JOB_OFFER_ACCEPTED": "Job Offer Accepted",
        "WITHDREW_APPLICATION": "Withdrew Application", "BLACKLISTED": "Blacklisted/Short-banned",
        "NOT_FIT": "Not Fit"
    };

    const stageCounter = {
        "TEST_SENT": "Pre-Screening Stage", "INTERVIEW_SCHEDULE_SENT": "Interview Schedule Stage", 
        "FIRST_INTERVIEW": "Interview Schedule Stage", "SECOND_INTERVIEW": "Interview Schedule Stage",
        "THIRD_INTERVIEW": "Interview Schedule Stage", "FOURTH_INTERVIEW": "Interview Schedule Stage",
        "FOLLOW_UP_INTERVIEW": "Interview Schedule Stage", "FOR_JOB_OFFER": "Job Offer Stage",
        "JOB_OFFER_REJECTED": "Job Offer Stage", "JOB_OFFER_ACCEPTED": "Job Offer Stage",
        "WITHDREW_APPLICATION": "Unsuccessful Stage/Pool", "BLACKLISTED": "Unsuccessful Stage/Pool",
        "NOT_FIT": "Unsuccessful Stage/Pool"
    };

    const sql = `
        SELECT ats_applicant_trackings.tracking_id, ats_applicant_progress.stage, 
                ats_applicant_progress.status, sl_company_jobs.title
        FROM ats_applicant_trackings
        INNER JOIN ats_applicant_progress ON ats_applicant_trackings.progress_id = ats_applicant_progress.progress_id
        INNER JOIN sl_company_jobs ON ats_applicant_trackings.position_id = sl_company_jobs.job_id
    `;

    const [results] = await pool.execute(sql);

    results.forEach(data => {
        if (!positionFilter || positionFilter == "All" || data.title == positionFilter) {
            const status = data.status;
            counter[stageMapping[status]] += 1;
            counter[stageCounter[status]] += 1;
        }
    });

    res.json(counter);
    
    // conn.query(sql, (err, result) => {
    //     if (err) return res.status(500).json({ error: "Database query failed" });

    //     result.forEach(data => {
    //         if (!positionFilter || positionFilter === "All" || data.title === positionFilter) {
    //             const status = data.status;
    //             counter[stageMapping[status]] += 1;
    //             counter[stageCounter[status]] += 1;
    //         }
    //     });

    //     res.json(counter);
    // });
};


exports.tryAPI = (req, res) => {
    const subject  = req.body
    console.log(subject)
    //console.log("subject is: " + subject)
    res.json({"message": "try"})
}