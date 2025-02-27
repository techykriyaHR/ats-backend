const pool = require("../../config/db");

//insert
const insertApplicant = (applicant) => {
    //here we will be inserting to multiple tables.
    // we need to insert into applicants, contacts_info, and applicants_trackings
    const sql = ``;
    const values = [];

    pool.execute(sql, values, (error, result) => {
        if (error) {
            return false;
        }
        return true;
    })
}

//get applicants from database
const getAllApplicants = () => {
    const sql = `
        SELECT *
        FROM applicants 
        INNER JOIN contacts_info
        ON contacts_info.contact_id = applicants.contact_id
    `;

    pool.execute(sql, (error, result) => {
        if (error) {
            return [];
        }
        return result;
    });
}


//compare 
const compare = (applicant, applicantsFromDB) => {
    const posibleDuplicates = []

    applicantsFromDB.forEach(applicantFromDb => {
        const similarity = []

        // both applicant and applicantFromDB are object
        const applicantFullname = applicant.first_name + " " + applicant.middle_name + " " + applicant.last_name;
        const applicantFromDBFullname = applicantFromDb.first_name + " " + applicantFromDb.middle_name + " " + applicantFromDb.last_name;

        if (applicant.first_name == applicantFromDb.first_name) {
            similarity.push(applicantFullname);
        }

        if (applicantFromDb.email_1) {
            if (applicant.email == applicantFromDb.email_1) {
                similarity.push(applicant.email);
            }
        }

        if (applicantFromDb.email_2) {
            if (applicant.email == applicantFromDb.email_2) {
                similarity.push(applicant.email);
            }
        }

        if (applicantFromDb.email_3) {
            if (applicant.email == applicantFromDb.email_3) {
                similarity.push(applicant.email);
            }
        }

        if (applicantFromDb.mobile_number_1) {
            if (applicant.contactNo == applicantFromDb.mobile_number_1) {
                similarity.push(applicant.contactNo);
            }
        }

        if (applicantFromDb.mobile_number_2) {
            if (applicant.contactNo == applicantFromDb.mobile_number_2) {
                similarity.push(applicant.contactNo);
            }
        }

        if (applicant.birthDate == applicantFromDb.birthDate) {
            similarity.push(birthDate);
        }

        if (similarity.length > 0) {
            posibleDuplicates.push({ applicantFromDb: applicantFromDb, similarity: similarity })
        }
    });

    return posibleDuplicates;
}




exports.addApplicant = (req, res) => {
        const applicant = req.body.applicant;

        const isSuccess = insertApplicant(applicant);
        if (isSuccess) {
            res.status(201).json({message: "successfully inserted"})
        }
        res.status(500).json({message: "failed to insert"})
}

exports.uploadApplicants = (req, res) => {
    try {
        const applicants = req.body.applicants;
        const flagged = [];
        console.log("applicants array of object literal: ", applicants);

        //get data from database
        const applicantsFromDB = getAllApplicants();

        //compare
        applicants.forEach((applicant) => {
            //algorithm for comparison
            const posibleDuplicates = compare(applicant, applicantsFromDB);

            if (posibleDuplicates.length > 0) {
                //flagged as potential duplicates
                flagged.push({ applicant: applicant, posibleDuplicates: posibleDuplicates })
            } else {
                //insert to the db if not flag as duplicate
                insertApplicant(applicant);
            }
        });


        if (flagged.length > 0) {
            res.status(200).json({message: "duplicates detected", flagged: flagged})
        }
        else {
            res.status(201).json({message: "All applicants successfully inserted"})
        }

    } catch (error) {
        res.json({ message: error });
    }
}