const getApplicants = (req, res) => {
    const company_id = req.params.company_id;

    res.json({sample: "cats", sample2: "dogs"})
}

const getApplicantsFilter = (req, res) => {
    const filter = req.body;
    const company_id = req.params.company_id;

    //filter logic. Extract the keys in the filter object which represents the filter option

}

module.exports = {
    getApplicants, 
    getApplicantsFilter
}