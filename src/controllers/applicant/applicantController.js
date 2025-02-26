exports.getAllApplicants = (req, res) => {

}

exports.getApplicantsFilter = (req, res) => {
    const filter = req.body;

    //filter logic. Extract the keys in the filter object which represents the filter option
}

exports.getApplicant = (req, res) => {

    res.json({sample: "cats", sample2: "dogs"})
}
