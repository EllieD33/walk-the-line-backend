const db = require("../db/connection");
const bcrypt = require("bcrypt");

const fetchUser = async (username, password) => {
    try {
      const userQueryStr = `SELECT * 
                        FROM users 
                        WHERE username = $1;`;
      const user = await db.query(userQueryStr, [username]);
      if (!user.rows.length) return null;

      const storedPassword = user.rows[0].password;
      const isPasswordValid = await bcrypt.compare(password, storedPassword);

      if (!isPasswordValid) return null;

      return user.rows[0];
  } catch (err) {
    return Promise.reject({ status: 401, msg: "Invalid credentials" });
  }
};

const fetchUserByUsername = async (username) => {
  try {
    const queryStr = `SELECT * FROM users WHERE username = $1`;
    const result = await db.query(queryStr, [username]);
    return result.rows[0];
  } catch (err) {
    return Promise.reject({ status: 404, msg: "Not found" });
  }
};

const createUser =  async (username, hashedPassword) => {
  try {
    const insertStr = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`;
    const result = await db.query(insertStr, [username, hashedPassword]);
    return result.rows[0];
  } catch (err) {
    return Promise.reject({ status: 500, msg: "Failed to create user" });
  }
}

const removeUserAccount = async (username) => {
    let queryText = 'DELETE FROM users WHERE username = $1;';
    const deletionResult = await db.query(queryText, [username]);

    if (deletionResult.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
    }
    return 
  
}

module.exports = { fetchUser, fetchUserByUsername, createUser, removeUserAccount };
