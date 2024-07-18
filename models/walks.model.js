const db = require("../db/connection")
const format = require('pg-format');


const fetchWalks = async (walk_id, creator_id, difficultyRequired, minDistance, maxDistance) => {
    let queryText = `
        SELECT wlk.*, usr.username
        FROM walks wlk
        JOIN users usr ON usr.user_id = wlk.creator_id
        WHERE 1 = 1`;
    
    const queryValues = [];

    if (walk_id) {
        queryText += ` AND wlk.walk_id = $${queryValues.push(walk_id)}`;
    }

    if (creator_id) {
        queryText += ` AND wlk.creator_id = $${queryValues.push(creator_id)}`;
    }

    if (difficultyRequired) {
        queryText += ` AND wlk.difficulty = $${queryValues.push(difficultyRequired)}`;
    }

    if (minDistance) {
        queryText += ` AND wlk.distance_km >= $${queryValues.push(minDistance)}`;
    }

    if (maxDistance) {
        queryText += ` AND wlk.distance_km <= $${queryValues.push(maxDistance)}`;
    }

    if (queryValues.length === 0) {
        queryText = `
            SELECT wlk.*, usr.username
            FROM walks wlk
            JOIN users usr ON usr.user_id = wlk.creator_id`;
    }

    const { rows } = await db.query(queryText, queryValues);

    if (walk_id && rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
    }

    return rows;
};


const createTrail = async (trailObj) => {
    const { walk, locations } = trailObj;

    const insertWalkText = `
        INSERT INTO walks (
            creator_id, title, description, distance_km,
            ascent, difficulty, start_latitude, start_longitude, start_altitude
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`;

    const walkValues = [
        walk.creator_id, walk.title, walk.description, walk.distance_km,
        walk.ascent, walk.difficulty, walk.start_latitude, walk.start_longitude, walk.start_altitude
    ];

    const { rows: [insertedWalk] } = await db.query(insertWalkText, walkValues);

    if (!insertedWalk) {
        throw new Error('Failed to insert walk');
    }

    const walkId = insertedWalk.walk_id;

    const locationsValues = locations.map(loc => [
        walkId, loc.latitude, loc.longitude, loc.altitude
    ]);

    const insertLocationsText = format(`
        INSERT INTO walk_location_points (walk_id, latitude, longitude, altitude)
        VALUES %L
    `, locationsValues);

    await db.query(insertLocationsText);

    return { walk: insertedWalk };
}

const removeWalk = async (walk_id) => {
    if (!Number.isInteger(walk_id)) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }

    let deleteStr = 'DELETE FROM walks WHERE walk_id = $1;'
    const deleteResult = await db.query(deleteStr, [walk_id])

    if (deleteResult.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
    }
}

module.exports = {createTrail, fetchWalks, removeWalk}