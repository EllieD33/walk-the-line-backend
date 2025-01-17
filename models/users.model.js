const db = require("../db/connection");
const bcrypt = require("bcrypt");

const fetchUser = async (username, password) => {
    try {
      const queryText = `SELECT * 
                        FROM users 
                        WHERE username = $1;`;
      const user = await db.query(queryText, [username]);
      if (!user.rows.length) return null;

      const storedPassword = user.rows[0].password;
      const isPasswordValid = await bcrypt.compare(password, storedPassword);

      if (!isPasswordValid) return null;

      return user.rows[0];
  } catch (err) {
    return Promise.reject({ status: 401, msg: "Invalid credentials" });
  }
};

const fetchAllUsers = async () => {
  try {
    const queryText = `SELECT username FROM users`
    const result = await db.query(queryText);
    const usernames = result.rows.map((user) => user.username);
    return { users: usernames};
  } catch (err) {
    return Promise.reject({ status: 500, msg: "Server error" })
  }
}

const fetchUserByUsername = async (username) => {
  try {
    const queryText = `SELECT * FROM users WHERE username = $1`;
    const result = await db.query(queryText, [username]);
    return result.rows[0];
  } catch (err) {
    return Promise.reject({ status: 404, msg: "Not found" });
  }
};

const createUser =  async (username, hashedPassword, email) => {
  try {
    const queryText = `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *`;
    const result = await db.query(queryText, [username, hashedPassword, email]);
    return result.rows[0];
  } catch (err) {
    return Promise.reject({ status: 500, msg: "Failed to create user" });
  }
}

const removeUserAccount = async (username) => {
    const queryText = 'DELETE FROM users WHERE username = $1;';
    const deletionResult = await db.query(queryText, [username]);

    if (deletionResult.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
    }
    return 
  
}

module.exports = { fetchUser, fetchAllUsers, fetchUserByUsername, createUser, removeUserAccount };
