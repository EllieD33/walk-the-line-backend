const usersRouter = require('express').Router()
const {signUp, signIn, getUserByUsername } = require('../controllers/users.controller')

usersRouter.post('/signup', signUp);
usersRouter.post('/signin', signIn);
usersRouter.get('/:username', getUserByUsername)

module.exports = usersRouter