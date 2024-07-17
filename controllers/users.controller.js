const bcrypt = require('bcrypt');
const { createUser, fetchUser, fetchUserByUsername } = require("../models/users.model");

const signUp = async (req, res) => {
  const { username, password } = req.body;

  try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await createUser(username, hashedPassword);
      res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
      console.error('Error during sign-up:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const signIn = async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await fetchUser(username, password);

      if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      res.json({ user: { id: user.user_id, username: user.username } });
  } catch (error) {
      console.error('Error during sign-in:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await fetchUserByUsername(username);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
} catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
}
}

module.exports = { signUp, signIn, getUserByUsername };
