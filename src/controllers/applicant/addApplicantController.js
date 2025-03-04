const { v4: uuidv4 } = require("uuid");
const pool = require("../../config/db");
const app = require("../../app");


//insert
const insertApplicant = async (applicant) => {
    const applicant_id = uuidv4();
    const contact_id = uuidv4();
    const tracking_id = uuidv4();
    const progress_id = uuidv4();

    try {
        // Insert into applicants
        let sql = `INSERT INTO ats_applicants (applicant_id, first_name, middle_name, last_name, contact_id, gender, birth_date, discovered_at, cv_link) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let values = [
            applicant_id,
            applicant.first_name,
            applicant.middle_name || null,
            applicant.last_name,
            contact_id,
            applicant.gender,
            applicant.birth_date,
            applicant.discovered_at,
            applicant.cv_link || null
        ];

        await pool.execute(sql, values);

        // Insert into contacts_info
        sql = `INSERT INTO ats_contact_infos (contact_id, applicant_id, mobile_number_1, mobile_number_2, email_1, email_2, email_3) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        values = [
            contact_id,
            applicant_id,
            applicant.mobile_number_1 || null,
            applicant.mobile_number_2 || null,
            applicant.email_1,
            applicant.email_2 || null,
            applicant.email_3 || null
        ];
        await pool.execute(sql, values);

        // Insert into applicants_trackings
        sql = `INSERT INTO ats_applicant_trackings (tracking_id, applicant_id, progress_id, created_by, updated_by, applied_source, referrer_id, company_id, position_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        values = [
            tracking_id,
            applicant_id,
            progress_id,
            applicant.created_by,
            applicant.updated_by,
            applicant.applied_source || null,
            applicant.referrer_id || null,
            applicant.company_id,
            applicant.position_id
        ];
        await pool.execute(sql, values);


        sql = `INSERT INTO ats_applicant_progress (progress_id, stage, status) VALUES (?, ?, ?)`;
        values = [
            progress_id, 
            'PRE_SCREENING', 
            'NONE'
        ];

        await pool.execute(sql, values);

        return true;
    } catch (error) {
        console.error("Error inserting applicant:", error);
        return false;
    }
};

//get applicants from database
const getAllApplicants = async () => {
    const sql = `
        SELECT *
        FROM ats_applicants
        INNER JOIN ats_contact_infos USING (contact_id)
    `;

    try {
        const [results, fields] = await pool.execute(sql);
        return results
    } catch (error) {
        console.error(error);
        return [];
    }
}

//compare 
const compare = (applicant, applicantsFromDB) => {
    const posibleDuplicates = []

    applicantsFromDB.forEach(applicantFromDb => {
        const similarity = []

        // both applicant and applicantFromDB are object
        const applicantFullname = `${applicant.first_name} ${applicant.middle_name ?? ""} ${applicant.last_name}`.trim();
        const applicantFromDBFullname = `${applicantFromDb.first_name} ${applicantFromDb.middle_name ?? ""} ${applicantFromDb.last_name}`.trim();

        
        if (applicant.first_name == applicantFromDb.first_name) {
            similarity.push("Name");
        }

        if (applicantFromDb.email_1) {
            if (applicant.email == applicantFromDb.email_1) {
                similarity.push("Email");
            }
        }

        if (applicantFromDb.email_2) {
            if (applicant.email == applicantFromDb.email_2) {
                similarity.push("Second Email");
            }
        }

        if (applicantFromDb.email_3) {
            if (applicant.email == applicantFromDb.email_3) {
                similarity.push("Third Email");
            }
        }

        if (applicantFromDb.mobile_number_1) {
            if (applicant.contactNo == applicantFromDb.mobile_number_1) {
                similarity.push("Mobile Number");
            }
        }

        if (applicantFromDb.mobile_number_2) {
            if (applicant.contactNo == applicantFromDb.mobile_number_2) {
                similarity.push("Second Mobile Number");
            }
        }

        if (applicant.birth_date == applicantFromDb.birth_date) {
            similarity.push("Birthdate");
        }

        if (similarity.length > 0) {
            posibleDuplicates.push({ applicantFromDb: applicantFromDb, similarity: similarity })
        }
    });

    return posibleDuplicates;
}

//This works for both checking from Suitelifer's website &
//detecting duplicates on manual input of applicants in ATS. 
exports.checkDuplicates =  async (req, res) => {
    const applicant = JSON.parse(req.body.applicant);
    const applicantsFromDB = await getAllApplicants();

    const posibleDuplicates = compare(applicant, applicantsFromDB);
    if (posibleDuplicates.length > 0) {
        return res.json({isDuplicate: true, message: "possible duplicates detected", posibleDuplicates: posibleDuplicates});
    }
    return res.json({isDuplicate: false, message: "no duplicates detected"});
}

//create a code for realtime detection off duplicates
//We first check whether duplicates exist using checkDuplicates controller. 
//If it is false, we proceed to add it on using addApplicant controller. 
exports.addApplicant = async (req, res) => {
    const applicant = JSON.parse(req.body.applicant);

    const isSuccess = await insertApplicant(applicant);
    if (isSuccess) {
        return res.status(201).json({ message: "successfully inserted" })
    }
    res.status(500).json({ message: "failed to insert" })
}

exports.uploadApplicants = async (req, res) => {
    try {
        const applicants = JSON.parse(req.body.applicants);
        
        const flagged = [];
        console.log("applicants array of object literal: ", applicants);
        console.log("type ", typeof(applicants));
        //get data from database
        const applicantsFromDB = await getAllApplicants();

        //compare
        applicants.forEach((applicant) => {
            //algorithm for comparison
            const posibleDuplicates = compare(applicant, applicantsFromDB);

            if (posibleDuplicates.length > 0) {
                //flagged as potential duplicates
                flagged.push({ applicant: applicant, posibleDuplicates: posibleDuplicates })
            } else {
                //insert to the db if not flag as duplicate
                insertApplicant(applicant) ? console.log("inserted") : console.log("failed");
            }
        });

        if (flagged.length > 0) {
            return res.status(200).json({ message: "duplicates detected", flagged: flagged })
        }
        return res.status(201).json({ message: "All applicants successfully inserted" })
    } catch (error) {
        res.status(500).json({ message: "Error processing applicants", error });
    }
}