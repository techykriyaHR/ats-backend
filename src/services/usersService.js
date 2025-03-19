const pool = require("../../config/db");

const getAllUsers = async () => {
    try {
        //return list of users
        const sql = `
            SELECT
                a.*,
                i.*,
            FROM hris_user_accounts a
            INNER JOIN hris_user_infos i ON a.user_id = i.user_id
        `;

        const [results] = await pool.execute(sql);
        return results;
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

const getUserInfo = async (user_id) => {
    try {
        const sql = `
            SELECT
                a.*,
                i.*,
                c.app_password
            FROM hris_user_accounts a
            INNER JOIN hris_user_infos i ON a.user_id = i.user_id
            INNER JOIN ats_smtp_credentials c ON i.user_id = c.user_id
            WHERE a.user_id = ?;
        `;

        const [results] = await pool.execute(sql, [user_id]);
        return results[0];
    } catch (error) {
        console.log(error.message);
        return [];

    }
}

module.exports = {
    getAllUsers, 
    getUserInfo
}