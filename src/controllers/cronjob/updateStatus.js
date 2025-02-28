const cron = require("node-cron")
const pool = require("../../config/db");


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

const updateStatus = () => {

}

const checkStatus = () => {
    
}

const updateStatusCronJob = () => {
    //runs every minute
    // cron.schedule("* * * * *", () => {
    //     console.log("scheduled job is runnning.")
    // });

    //runs everyday at midnight
    cron.schedule("0 0 * * *", () => {
        console.log("scheduled job is runnning...");

        
        //check
        
        
        //if updated
            //add to notification
            
            //email

        //
    });
}


module.exports = updateStatusCronJob;