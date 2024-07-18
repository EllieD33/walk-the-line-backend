const {createTrail, fetchWalks, removeWalk} = require('../models/walks.model')

const getWalks = async (req, res, next) => {
    try {
        const { walk_id } = req.params;
        const { difficulty, minDistance, maxDistance, creator_id } = req.query;
        const walks = await fetchWalks(walk_id, creator_id, difficulty, minDistance, maxDistance)
        res.status(200).send({ walks })
    }
    catch(err) {
        next(err)
    }
}

const postTrail = async (req, res, next) => {
    try {
        const newTrail = req.body
        const postTrailResponse = await createTrail(newTrail)
        res.status(201).send(postTrailResponse)
    }
    catch(err) {
        next(err)
    }
}

const deleteWalk = async (req, res, next) => {
    try {
        const { walk_id } = req.params;
        await removeWalk(parseInt(walk_id))
        res.sendStatus(204);
    }
    catch(err) {
        next(err)
    }
}


module.exports = { getWalks, postTrail, deleteWalk }