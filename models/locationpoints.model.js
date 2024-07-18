const db = require("../db/connection");
const { checkWalkExists } = require('../utils/db.utils');

const fetchLocationPoints = async (walkId) => {
    const walkExists = await checkWalkExists(walkId);
    if (!walkExists) {
        return Promise.reject({ status: 404, msg: 'Not found' });
    }

    const queryText =   `
        SELECT *
        FROM walk_location_points 
        WHERE walk_id = $1
        ORDER BY location_timestamp, location_point_id;
    `;

    try {
        const { rows } = await db.query(queryText, [walkId]);
        return rows;
    } catch (err) {
        return Promise.reject({ status: 500, msg: "Failed to fetch location points" })
    }
};

module.exports = { fetchLocationPoints };