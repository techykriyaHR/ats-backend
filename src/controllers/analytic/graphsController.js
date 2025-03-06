const { fi } = require("date-fns/locale");
const pool = require("../../config/db");


const requisition_month = async (filter) => {
    try {
        const sql = `
            SELECT
                MONTHNAME(p.updated_at) AS label,
                COUNT(
                    CASE
                        WHEN p.status IN ('JOB_OFFER_ACCEPTED', 'JOB_OFFER_REJECTED', 'WITHDREW_APPLICATION', 'BLACKLISTED', 'NOT_FIT') 
                        THEN 1 
                    END
                ) AS closed, 
                COUNT(
                    CASE
                        WHEN p.status = 'JOB_OFFER_ACCEPTED' 
                        THEN 1 
                    END
                ) AS passed,
                COUNT(
                    CASE
                        WHEN p.status NOT IN ('JOB_OFFER_ACCEPTED', 'JOB_OFFER_REJECTED', 'WITHDREW_APPLICATION', 'BLACKLISTED', 'NOT_FIT') 
                        THEN 1 
                    END
                ) AS onProgress
            FROM ats_applicant_progress p
            INNER JOIN ats_applicant_trackings t ON t.progress_id = p.progress_id
            INNER JOIN sl_company_jobs j ON j.job_id = t.position_id
            ${filter.position ? 'WHERE j.title =' + "'" + filter.position + "'" : null}
            GROUP BY MONTHNAME(p.updated_at), MONTH(p.updated_at) 
            ORDER BY MONTH(p.updated_at);
        `;

        const [results] = await pool.execute(sql);
        return results;
    } catch (error) {
        console.log(error.message);
        return [];

    }
}


const requisition_year = async (filter) => {
    try {
        const sql = `
                SELECT
                    YEAR(p.updated_at) AS label,
                    COUNT(
                        CASE
                            WHEN p.status IN ('JOB_OFFER_ACCEPTED', 'JOB_OFFER_REJECTED', 'WITHDREW_APPLICATION', 'BLACKLISTED', 'NOT_FIT') 
                            THEN 1 
                        END
                    ) AS closed, 
                    COUNT(
                        CASE
                            WHEN p.status = 'JOB_OFFER_ACCEPTED' 
                            THEN 1 
                        END
                    ) AS passed,
                    COUNT(
                        CASE
                            WHEN p.status NOT IN ('JOB_OFFER_ACCEPTED', 'JOB_OFFER_REJECTED', 'WITHDREW_APPLICATION', 'BLACKLISTED', 'NOT_FIT') 
                            THEN 1 
                        END
                    ) AS onProgress
                FROM ats_applicant_progress p
                INNER JOIN ats_applicant_trackings t ON t.progress_id = p.progress_id
                INNER JOIN sl_company_jobs j ON j.job_id = t.position_id
                ${filter.position ? `WHERE j.title = '${filter.position}'` : ''}
                GROUP BY YEAR(p.updated_at)
                ORDER BY YEAR(p.updated_at);
            `;

        const [results] = await pool.execute(sql);
        return results;
    } catch (error) {
        console.log(error.message);
        return [];
    }
};

const requsition_all = async (filter) => {
    try {
        const sql = `
            SELECT
                MONTHNAME(p.updated_at) AS label,
                COUNT(
                    CASE
                        WHEN p.status IN ('JOB_OFFER_ACCEPTED', 'JOB_OFFER_REJECTED', 'WITHDREW_APPLICATION', 'BLACKLISTED', 'NOT_FIT') 
                        THEN 1 
                    END
                ) AS closed, 
                COUNT(
                    CASE
                        WHEN p.status = 'JOB_OFFER_ACCEPTED' 
                        THEN 1 
                    END
                ) AS passed,
                COUNT(
                    CASE
                        WHEN p.status NOT IN ('JOB_OFFER_ACCEPTED', 'JOB_OFFER_REJECTED', 'WITHDREW_APPLICATION', 'BLACKLISTED', 'NOT_FIT') 
                        THEN 1 
                    END
                ) AS onProgress
            FROM ats_applicant_progress p
            INNER JOIN ats_applicant_trackings t ON t.progress_id = p.progress_id
            INNER JOIN sl_company_jobs j ON j.job_id = t.position_id
            GROUP BY MONTHNAME(p.updated_at), MONTH(p.updated_at) 
            ORDER BY MONTH(p.updated_at);
        `;

        const [results] = await pool.execute(sql);
        return results;
    } catch (error) {
        console.log(error.message);
        return [];
    }
}


exports.requisition = async (req, res) => {
    //?position=all&month=march
    //?position=all%year=2022
    const filter = req.query;
    let results = [];

    if (filter.month) {
        results = await requisition_month(filter);
    } else if (filter.year) {
        results = await requisition_year(filter);
    }
    else {
        results = await requsition_all(filter);
    }

    res.status(200).json({ message: "okay", requsition: results })
}

exports.source = async (req, res) => {
    try {
        const sql = `
            SELECT discovered_at AS source, COUNT(*) AS value
            FROM ats_applicants
            GROUP BY discovered_at
        `;

        const [results] = await pool.execute(sql);
        res.status(200).json({ message: "okay", source: results });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

