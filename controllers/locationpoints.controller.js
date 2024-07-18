const { fetchLocationPoints } = require('../models/locationpoints.model')

const getLocationPoints = async (req, res, next) => {
    try {
        const walkId = parseInt(req.params.walk_id)

        if (isNaN(walkId)) {
            return res.sendStatus(400)
        }

        const locationPointsArray = await fetchLocationPoints(walkId)
        res.status(200).send({locationPoints: locationPointsArray})
    }
    catch {
        next(err)
    }
}


module.exports = {getLocationPoints}