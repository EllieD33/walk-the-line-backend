const { fetchLocationPoints } = require('../models/locationpoints.model')

const getLocationPoints = async (req, res, next) => {
    try {
        const walkId = parseInt(req.params.walk_id)

        if (isNaN(walkId)) {
            return res.status(400).send({ msg: 'Bad request' })
        }

        const locationPointsArray = await fetchLocationPoints(walkId)
        const locationPoints = locationPointsArray.map((point) => {
            return {...point, longitude: parseFloat(point.longitude), latitude: parseFloat(point.latitude), altitude: parseFloat(point.altitude)}
        })
        res.status(200).send({locationPoints})
    }
    catch (err) {
        next(err)
    }
}


module.exports = {getLocationPoints}