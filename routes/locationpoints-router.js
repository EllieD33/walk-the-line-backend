const locationPointsRouter = require('express').Router()
const {getLocationPoints} = require('../controllers/locationpoints.controller')

locationPointsRouter.get('/:walk_id', getLocationPoints)

module.exports = locationPointsRouter