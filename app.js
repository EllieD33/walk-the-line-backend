const cors = require('cors')
const express = require('express')
const { handleBadRequest, handleErrorMessage, handleServerError } = require('./error-handler')

const apiRouter = require("./routes/api-router")

const app = express()
app.use(cors())
app.use('/api', apiRouter)

app.use(handleBadRequest);
app.use(handleErrorMessage);
app.use(handleServerError);

module.exports = app