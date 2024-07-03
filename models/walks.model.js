const db = require("../db/connection")
const format = require('pg-format');

async function createTrail(trailObj) {
    const returnObj = {}

    // Insert the WALK record. 
    const walkObj = trailObj.walk
    let insertWalkStr = `INSERT INTO walks (
                                    creator_id,
                                    title,
                                    description, 
                                    distance_km,
                                    ascent,
                                    difficulty,
                                    start_latitude,
                                    start_longitude,
                                    start_altitude
                                ) 
                                VALUES ( 
                                    $1, 
                                    $2, 
                                    $3,
                                    $4, 
                                    $5, 
                                    $6,
                                    $7, 
                                    $8, 
                                    $9 ) RETURNING *;`

    const insertWalkResult = await db.query(insertWalkStr, [walkObj.creator_id,
                                                            walkObj.title,
                                                            walkObj.description, 
                                                            walkObj.distance_km,
                                                            walkObj.ascent,
                                                            walkObj.difficulty,
                                                            walkObj.start_latitude,
                                                            walkObj.start_longitude,
                                                            walkObj.start_altitude ])
    
    returnObj.walk = insertWalkResult.rows[0]
    const walkId = returnObj.walk.id

    // Insert WALK_LOCATION_POINTS records. 
    const locationsObj = trailObj.locations
    const insertWalkLocationsStr = format(`INSERT INTO walk_location_points (
                                                walk_id, 
                                                latitude, 
                                                longitude, 
                                                altitude) 
                                            VALUES %L;`, 
                                            locationsObj.map( ({latitude, longitude, altitude}) => [walkId, 
                                                                                                    latitude, 
                                                                                                    longitude,
                                                                                                    altitude
                                                                                                        ])
                                        )

    await db.query(insertWalkLocationsStr)

    return returnObj
}

async function fetchWalks(creatorId) {
    let walkQueryStr = `SELECT *
                        FROM walks`

    const queryParamArray = []

    if (creatorId) {
        queryParamArray.push(creatorId)
        walkQueryStr = walkQueryStr + ' WHERE creator_id = $1'
    }

    walkQueryStr = walkQueryStr + ';'

    const fetchWalksResult = await db.query(walkQueryStr, queryParamArray)

    return fetchWalksResult.rows
}


module.exports = {createTrail, fetchWalks}