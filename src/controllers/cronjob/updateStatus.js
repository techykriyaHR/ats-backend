const cron = require("node-cron")
const pool = require("../../config/db");
const { differenceInMonths } = require("date-fns");
const getBlackListedApplicants = async () => {
    const sql = `
                SELECT * 
                FROM applicants a
                INNER JOIN applicants_trackings at USING (applicant_id)
                INNER JOIN applicants_pogress ap USING (progress_id)
                WHERE ap.status == 'BLACKLISTED';
    `;

    try {
        const [results, fields] = await pool.execute(sql);
        return results
    } catch (error) {
        console.error(error);
        return [];
    }
}

// const updateStatus = (applicant) => {
//     const sql = `
//         UPDATE applications_progress 
//         SET stage='PRE-SCREENING', status='NONE', blacklisted_type='null', reason='null'

//     `;
// }

const updateStatus = async (applicant) => {
    try {
        const sql = `
            UPDATE applications_progress 
            SET stage=?, status=?, blacklisted_type=?, reason=?
            WHERE progress_id = ?
        `;
        const values = ['PRE-SCREENING', 'NONE', null, null, applicant.progress_id];
        await pool.execute(sql, values);

        return true
    } catch (error) {
        console.log(error);
        return false
    }
}

const checkDateElapsed = (applicant) => {
    try {
        if (applicant.blacklisted_type == "SOFT") {
            //differences in dates
            const updated_at = new Date(applicant.updated_at);
            const current_date = new Date.now();
            const difference = differenceInMonths(current_date, updated_at);

            if (difference >= 6) {
                return true
            }
        }
        else if (applicant.blacklisted_type == "HARD") {
            //differences in dates
            const updated_at = new Date(applicant.updated_at);
            const current_date = new Date.now();
            const difference = differenceInMonths(current_date, updated_at);

            if (difference >= 12) {
               return true
            }
        }
        else {
            return false;
        }
    } catch (error) {
        console.log(error)
    }
}

const updateStatusCronJob = () => {
    /*
    get blacklisted applicants
    check 
        if 6 or 12 months has elapsed
            update 
            add to notification
            sent email

    */

    //runs everyday at midnight
    cron.schedule("0 0 * * *", async () => {
        console.log("scheduled job is runnning...");
        const blacklistedApplicants = await getBlackListedApplicants();

        //check
        blacklistedApplicants.forEach(applicant => {
            if (checkDateElapsed(applicant)) {
                updateStatus(applicant);
                //sent to notification
                //sent email
            }
        });
    });
}


module.exports = updateStatusCronJob;