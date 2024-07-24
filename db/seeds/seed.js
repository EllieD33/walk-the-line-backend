const format = require('pg-format');
const db = require('../connection');
const bcrypt = require('bcrypt');

const seed = async ({ userData, walkData, walkLocationsData }) => {
    try {
        await dropTables(['walk_location_points', 'walks', 'users']);
    
        await createUsersTable();
        await createWalksTable();
        await createWalkLocationPointsTable();
    
        await seedUsers(userData);
        await seedWalks(walkData);
        await seedWalkLocationPoints(walkLocationsData);
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};

const dropTables = async (tableNames) => {
    await db.query(`
        DROP TABLE IF EXISTS ${tableNames.join(', ')} CASCADE;
    `);
};

const createUsersTable = async () => {
    await db.query(`
        CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR NOT NULL,
            email VARCHAR,
            password VARCHAR NOT NULL
        );
    `);
};

const createWalksTable = async () => {
    await db.query(`
        CREATE TABLE walks (
            walk_id SERIAL PRIMARY KEY,
            creator_id INT REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
            title VARCHAR NOT NULL,
            description VARCHAR,
            distance_km NUMERIC(4,2),
            ascent NUMERIC,
            rating NUMERIC,
            difficulty VARCHAR(50) CHECK (difficulty IN ('easy', 'moderate', 'challenging')),
            start_latitude NUMERIC(10,7) NOT NULL,
            start_longitude NUMERIC(10,7) NOT NULL,
            start_altitude NUMERIC(6,2) NOT NULL
        );
    `);
};

const createWalkLocationPointsTable = async () => {
    await db.query(`
        CREATE TABLE walk_location_points (
            location_point_id SERIAL PRIMARY KEY,
            walk_id INT REFERENCES walks(walk_id) ON DELETE CASCADE,
            latitude NUMERIC(10,7) NOT NULL,
            longitude NUMERIC(10,7) NOT NULL,
            altitude NUMERIC(6,2) NOT NULL,
            location_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

const seedUsers = async (userData) => {
    for (const user of userData) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    const insertUserStr = format(
        'INSERT INTO users (username, password, email) VALUES %L RETURNING *;',
        userData.map(({ username, password, email }) => [username, password, email])
    );
    await db.query(insertUserStr);
    const users = await db.query('SELECT * FROM users');
};

const seedWalks = async (walkData) => {
    const insertWalkStr = format(
        `INSERT INTO walks (
            creator_id,
            title,
            description,
            distance_km,
            ascent,
            rating,
            difficulty,
            start_latitude,
            start_longitude,
            start_altitude
        ) VALUES %L RETURNING *;`,
        walkData.map(({ creator_id, title, description, distance_km, ascent, rating, difficulty, start_latitude, start_longitude, start_altitude }) => [
            creator_id,
            title,
            description,
            distance_km,
            ascent,
            rating,
            difficulty,
            start_latitude,
            start_longitude,
            start_altitude
        ])
    );
    await db.query(insertWalkStr);
};

const seedWalkLocationPoints = async (walkLocationsData) => {
    for (const walkLocationData of walkLocationsData) {
        const insertWalkLocationsStr = format(
            `INSERT INTO walk_location_points (
                walk_id,
                latitude,
                longitude,
                altitude
            ) VALUES %L;`,
            walkLocationData.map(({ walk_id, latitude, longitude, altitude }) => [
                walk_id,
                latitude,
                longitude,
                altitude
            ])
        );
        await db.query(insertWalkLocationsStr);
    }
};

module.exports = seed;