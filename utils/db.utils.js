const db = require("../db/connection");

const checkWalkExists = async (walkId) => {
    const queryText = `
        SELECT 1
        FROM walks
        WHERE walk_id = $1
    `;
    try {
        const { rowCount } = await db.query(queryText, [walkId]);
        return rowCount > 0;
    } catch (err) {
        return Promise.reject({ status: 500, msg: 'Internal server error' });
    }
};

module.exports = { checkWalkExists };