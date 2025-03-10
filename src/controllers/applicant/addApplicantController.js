const { v4: uuidv4 } = require("uuid");
const pool = require("../../config/db");
const app = require("../../app");

// Insert applicant into the database
const insertApplicant = async (applicant) => {
    const applicant_id = uuidv4();
    const contact_id = uuidv4();
    const tracking_id = uuidv4();
    const progress_id = uuidv4();

    try {
        // Insert into ats_applicant_progress first
        let sql = `INSERT INTO ats_applicant_progress (progress_id, stage, status) VALUES (?, ?, ?)`;
        let values = [
            progress_id, 
            'PRE_SCREENING', 
            'NONE'
        ];
        await pool.execute(sql, values);

        // Insert into ats_applicant_trackings
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
            "468eb32f-f8c1-11ef-a725-0af0d960a833",
            applicant.position_id
        ];
        await pool.execute(sql, values);

        // Insert into ats_applicants
        sql = `INSERT INTO ats_applicants (applicant_id, first_name, middle_name, last_name, contact_id, gender, birth_date, discovered_at, cv_link) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        values = [
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

        // Insert into ats_contact_infos
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

        return true;
    } catch (error) {
        console.error("Error inserting applicant:", error);
        return false;
    }
};

// Get all applicants from the database
const getAllApplicants = async () => {
    const sql = `
        SELECT *
        FROM ats_applicants
        INNER JOIN ats_contact_infos USING (contact_id)
    `;

    try {
        const [results, fields] = await pool.execute(sql);
        return results;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Compare applicants for duplicates
const compare = (applicant, applicantsFromDB) => {
    const possibleDuplicates = [];

    applicantsFromDB.forEach(applicantFromDb => {
        const similarity = [];

        const applicantFullname = `${applicant.first_name} ${applicant.middle_name ?? ""} ${applicant.last_name}`.trim();
        const applicantFromDBFullname = `${applicantFromDb.first_name} ${applicantFromDb.middle_name ?? ""} ${applicantFromDb.last_name}`.trim();

        if (applicant.first_name === applicantFromDb.first_name) {
            similarity.push("Name");
        }

        if (applicantFromDb.email_1 && applicant.email === applicantFromDb.email_1) {
            similarity.push("Email");
        }

        if (applicantFromDb.email_2 && applicant.email === applicantFromDb.email_2) {
            similarity.push("Second Email");
        }

        if (applicantFromDb.email_3 && applicant.email === applicantFromDb.email_3) {
            similarity.push("Third Email");
        }

        if (applicantFromDb.mobile_number_1 && applicant.contactNo === applicantFromDb.mobile_number_1) {
            similarity.push("Mobile Number");
        }

        if (applicantFromDb.mobile_number_2 && applicant.contactNo === applicantFromDb.mobile_number_2) {
            similarity.push("Second Mobile Number");
        }

        if (applicant.birth_date === applicantFromDb.birth_date) {
            similarity.push("Birthdate");
        }

        if (similarity.length > 0) {
            possibleDuplicates.push({ applicantFromDb: applicantFromDb, similarity: similarity });
        }
    });

    return possibleDuplicates;
};

// Check for duplicates
exports.checkDuplicates = async (req, res) => {
    const applicant = JSON.parse(req.body.applicant);
    const applicantsFromDB = await getAllApplicants();

    const possibleDuplicates = compare(applicant, applicantsFromDB);
    if (possibleDuplicates.length > 0) {
        return res.json({ isDuplicate: true, message: "possible duplicates detected", possibleDuplicates: possibleDuplicates });
    }
    return res.json({ isDuplicate: false, message: "no duplicates detected" });
};

// Add applicant
exports.addApplicant = async (req, res) => {
    const applicant = JSON.parse(req.body.applicant);

    const isSuccess = await insertApplicant(applicant);
    if (isSuccess) {
        return res.status(201).json({ message: "successfully inserted" });
    }
    res.status(500).json({ message: "failed to insert" });
};

// Upload applicants
exports.uploadApplicants = async (req, res) => {
    try {
        const applicants = JSON.parse(req.body.applicants);

        const flagged = [];
        console.log("applicants array of object literal: ", applicants);
        console.log("type ", typeof(applicants));
        const applicantsFromDB = await getAllApplicants();

        applicants.forEach((applicant) => {
            const possibleDuplicates = compare(applicant, applicantsFromDB);

            if (possibleDuplicates.length > 0) {
                flagged.push({ applicant: applicant, possibleDuplicates: possibleDuplicates });
            } else {
                insertApplicant(applicant) ? console.log("inserted") : console.log("failed");
            }
        });

        if (flagged.length > 0) {
            return res.status(200).json({ message: "duplicates detected", flagged: flagged });
        }
        return res.status(201).json({ message: "All applicants successfully inserted" });
    } catch (error) {
        res.status(500).json({ message: "Error processing applicants", error });
    }
};