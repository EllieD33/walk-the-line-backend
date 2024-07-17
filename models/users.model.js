const db = require("../db/connection");
const bcrypt = require("bcrypt");

const fetchUser = async (username, password) => {
    const userQueryStr = `SELECT * 
                        FROM users 
                        WHERE username = $1;`;
    const user = await db.query(userQueryStr, [username]);
    if (!user.rows.length) return null;

    const storedPassword = user.rows[0].password;
    const isPasswordValid = await bcrypt.compare(password, storedPassword);

    if (!isPasswordValid) return null;

    return user.rows[0];
};

const fetchUserByUsername = async (username) => {
  const queryStr = `SELECT * FROM users WHERE username = $1`;
  const result = await db.query(queryStr, [username]);
  return result.rows[0];
};

const createUser =  async (username, hashedPassword) => {
  const insertStr = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`;
  const result = await db.query(insertStr, [username, hashedPassword]);
  return result.rows[0];
}

module.exports = { fetchUser, fetchUserByUsername, createUser };
