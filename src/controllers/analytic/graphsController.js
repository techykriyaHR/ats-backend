const pool = require("../../config/db");

exports.requisition = async (req, res) => {
    try {
        // const sql = `
        //     SELECT 
        //         MONTHNAME(aap.updated_at) AS month,
        //         COUNT(CASE WHEN aap.status IN ('JOB_OFFER_ACCEPTED', 'JOB_OFFER_REJECTED', 'WITHDREW_APPLICATION', 'BLACKLISTED', 'NOT_FIT') THEN 1 END) AS closed,
        //         COUNT(CASE WHEN aap.status = 'JOB_OFFER_ACCEPTED' THEN 1 END) AS passed,
        //         COUNT(CASE WHEN aap.status NOT IN ('JOB_OFFER_ACCEPTED', 'JOB_OFFER_REJECTED', 'WITHDREW_APPLICATION', 'BLACKLISTED', 'NOT_FIT') THEN 1 END) AS onProgress,
        //     FROM ats_applicant_progress aap
        //     WHERE YEAR(aap.updated_at) = YEAR(CURDATE())
        //     GROUP BY MONTHNAME(aap.updated_at)
        //     ORDER BY MONTHNAME(aap.updated_at);
        // `;

        const sql = `
            SELECT 
                MONTHNAME(p.updated_at) AS label,
                COUNT(
                    CASE
                        WHEN
                            p.status IN ('JOB_OFFER_ACCEPTED', 'JOB_OFFER_REJECTED', 'WITHDREW_APPLICATION', 'BLACKLISTED', 'NOT_FIT')
                        THEN
                            1
                    END
                ) AS closed, 
                COUNT(
                    CASE
                        WHEN
                            p.status = 'JOB_OFFER_ACCEPTED'
                        THEN
                            1
                    END
                ) as passed,
                COUNT(
                    CASE
                        WHEN 
                            p.status NOT IN ('JOB_OFFER_ACCEPTED', 'JOB_OFFER_REJECTED', 'WITHDREW_APPLICATION', 'BLACKLISTED', 'NOT_FIT')
                        THEN
                            1
                    END
                ) AS onProgress
            FROM ats_applicant_progress p
            GROUP BY MONTHNAME(p.updated_at);
        `;
        const [results] = await pool.execute(sql);
        res.status(200).json({message: "okay", requsition: results})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
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
        res.status(500).json({message: error.message})
    }
}

