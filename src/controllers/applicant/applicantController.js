exports.getAllApplicants = (req, res) => {
    const company_id = req.params.company_id;
}

exports.getApplicantsFilter = (req, res) => {
    const filter = req.body;
    const company_id = req.params.company_id;

    //filter logic. Extract the keys in the filter object which represents the filter option

}

exports.getApplicant = (req, res) => {
    const company_id = req.params.company_id;

    res.json({sample: "cats", sample2: "dogs"})
}
