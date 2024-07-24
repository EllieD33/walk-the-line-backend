const {createTrail, fetchWalks, removeWalk} = require('../models/walks.model')

const getWalks = async (req, res, next) => {
    try {
        const { walk_id } = req.params;
        const { difficulty, minDistance, maxDistance, creator_id } = req.query;
        const result = await fetchWalks(walk_id, creator_id, difficulty, minDistance, maxDistance);
        const walks = result.map((walk) => {
            return {
                ...walk,
                distance_km: parseFloat(walk.distance_km),
                ascent: parseFloat(walk.ascent),
                start_latitude: parseFloat(walk.start_latitude),
                start_longitude: parseFloat(walk.start_longitude),
                start_altitude: parseFloat(walk.start_altitude),
            }
        });
        res.status(200).send({ walks })
    }
    catch(err) {
        next(err);
    }
}

const postTrail = async (req, res, next) => {
    try {
        const newTrail = req.body
        const postTrailResponse = await createTrail(newTrail)
        res.status(201).send(postTrailResponse)
    }
    catch(err) {
        next(err);
    }
}

const deleteWalk = async (req, res, next) => {
    try {
        const { walk_id } = req.params;
        await removeWalk(parseInt(walk_id))
        res.sendStatus(204);
    }
    catch(err) {
        next(err);
    }
}


module.exports = { getWalks, postTrail, deleteWalk }