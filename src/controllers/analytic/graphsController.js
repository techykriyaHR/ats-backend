const pool = require("../../config/db");

const getRequisitionData = async (filter, groupBy) => {
    try {
        const selectColumn = groupBy === 'year' ? 'YEAR(p.updated_at)' : 'MONTHNAME(p.updated_at)';
        const groupColumn = groupBy === 'year' ? 'YEAR(p.updated_at)' : 'MONTHNAME(p.updated_at), MONTH(p.updated_at) ';
        const orderColumn = groupBy === 'year' ? 'YEAR(p.updated_at)' : 'MONTH(p.updated_at)';
        
        const sql = `
            SELECT
                ${selectColumn} AS label,
                COUNT(CASE WHEN p.status IN ('JOB_OFFER_ACCEPTED', 'JOB_OFFER_REJECTED', 'WITHDREW_APPLICATION', 'BLACKLISTED', 'NOT_FIT') THEN 1 END) AS closed, 
                COUNT(CASE WHEN p.status = 'JOB_OFFER_ACCEPTED' THEN 1 END) AS passed,
                COUNT(CASE WHEN p.status NOT IN ('JOB_OFFER_ACCEPTED', 'JOB_OFFER_REJECTED', 'WITHDREW_APPLICATION', 'BLACKLISTED', 'NOT_FIT') THEN 1 END) AS onProgress
            FROM ats_applicant_progress p
            INNER JOIN ats_applicant_trackings t ON t.progress_id = p.progress_id
            INNER JOIN sl_company_jobs j ON j.job_id = t.position_id
            ${filter.position ? `WHERE j.title = ?` : ''}
            GROUP BY ${groupColumn}
            ORDER BY ${orderColumn};
        `;

        const queryParams = filter.position ? [filter.position] : [];
        const [results] = await pool.execute(sql, queryParams);
        return results;
    } catch (error) {
        console.error(error.message);
        return [];
    }
};

exports.requisition = async (req, res) => {
    const filter = req.query;
    let results = [];

    if (filter.month) {
        results = await getRequisitionData(filter, 'month');
    } else if (filter.year) {
        results = await getRequisitionData(filter, 'year');
    } else {
        results = await getRequisitionData(filter, 'all');
    }

    res.status(200).json({ message: "okay", requisition: results });
};

exports.source = async (req, res) => {
    try {
        const sql = `
            SELECT discovered_at AS source, COUNT(*) AS value
            FROM ats_applicants
            GROUP BY discovered_at;
        `;
        
        const [results] = await pool.execute(sql);
        res.status(200).json({ message: "okay", source: results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
