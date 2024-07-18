const walksRouter = require('express').Router()
const {getWalks, postTrail, deleteWalk} = require('../controllers/walks.controller')

walksRouter.get('/', getWalks);
walksRouter.post('/', postTrail);

walksRouter.get('/:walk_id', getWalks);
walksRouter.delete('/:walk_id', deleteWalk);

module.exports = walksRouter