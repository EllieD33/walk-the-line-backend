const express = require('express')
const apiRouter = require('express').Router()

const walksRouter = require('./walks-router')
const locationPointsRouter = require('./locationpoints-router')
const usersRouter = require('./users-router')

apiRouter.use(express.json())

// Endpoints. 
apiRouter.use('/walklocationpoints/', locationPointsRouter)
apiRouter.use('/walks', walksRouter)
apiRouter.use('/users', usersRouter)

module.exports = apiRouter;