const db = require("../db/connection")

const fetchLocationPoints = async (walkId) => {
    const queryText =   `
        SELECT *
        FROM walk_location_points 
        WHERE walk_id = $1
        ORDER BY location_timestamp, id;
    `;

    try {
        const { rows } = await db.query(queryText, [walkId]);
        return rows;
    } catch (err) {
        next(err)
    }
};

module.exports = { fetchLocationPoints };