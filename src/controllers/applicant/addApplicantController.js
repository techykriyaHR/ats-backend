// const pool = require("./config/db");

//insert
// const insertApplicant = (applicant) => {
//     pool
// }

//get applicants from database

//compare

//flag duplicates

//return duplicates

/*
app.get("/test-api", (req, res) => {

    pool.query('SELECT * FROM users', function (err, results, fields) {
        if (err) throw err;
        console.log(results);
    });

    res.json({ message: "backend is working..." })
})
*/



exports.addApplicant = (req, res) => {

}

exports.uploadApplicants = (req, res) => {
    try {
        const applicants = req.body.applicants;
        console.log("applicants array of object literal: ", applicants);

        //get data from database

        //compare

        //flag duplicates

        //return duplicates

        res.json({ message: "okay" });
    } catch (error) {
        res.json({ message: error });
    }
}