const bcrypt = require("bcrypt");
const { createUser, fetchUser, fetchAllUsers, fetchUserByUsername, removeUserAccount } = require("../models/users.model");

const signUp = async (req, res, next) => {
    const { username, password, email } = req.body;

    try {
        const existingUser = await fetchUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await createUser(username, hashedPassword, email);
        const { password: userPassword, ...userWithoutPassword } = user;
        res.status(201).send({user: userWithoutPassword});
    } catch (error) {
        next(error);
    }
};

const signIn = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await fetchUser(username, password);

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({ user: { user_id: user.user_id, username: user.username } });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next)   => {
    try {
        const users = await fetchAllUsers();
        res.status(200).send(users);
    } catch (error) {
        next(error)
    }
}

const getUserByUsername = async (req, res, next) => {
    const { username } = req.params;
    try {
        const user = await fetchUserByUsername(username);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        next(error);
    }
};

const deleteUserAccount = async (req, res, next) => {
    const { username } = req.params;
    try {
        await removeUserAccount(username);
        res.status(204).send(); 
    } catch (error) {
        next(error);
    }
}

module.exports = { signUp, signIn, getAllUsers, getUserByUsername, deleteUserAccount };
