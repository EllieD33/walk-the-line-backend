const usersRouter = require('express').Router()
const {signUp, signIn, getAllUsers, getUserByUsername, deleteUserAccount } = require('../controllers/users.controller')

usersRouter.get('/', getAllUsers);
usersRouter.post('/signup', signUp);
usersRouter.post('/signin', signIn);

usersRouter.get('/:username', getUserByUsername);
usersRouter.delete('/:username', deleteUserAccount);

module.exports = usersRouter