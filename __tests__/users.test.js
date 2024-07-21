const app = require("../app");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");

require("pg").defaults.parseInt8 = true;

beforeEach(async () => await seed(testData));
afterAll(async () => await db.end());

describe("POST /api/users/signin", () => {
    test("200: signs in an existing user", async () => {
        const credentials = {
            username: "GingerSpice",
            password: "Geri", 
        };

        const response = await request(app)
            .post("/api/users/signin")
            .send(credentials)
            .expect(200);

        expect(response.body.user.username).toBe(credentials.username);
    });

    test("401: on invalid credentials during signin", async () => {
        const invalidCredentials = {
            username: "GingerSpice",
            password: "WrongPassword",
        };

        const response = await request(app)
            .post("/api/users/signin")
            .send(invalidCredentials)
            .expect(401);

        expect(response.body.message).toBe("Invalid credentials");
    });
});

describe("POST /api/users/signup", () => {
    test("201: creates a new user", async () => {
        const newUser = {
            username: "newuser",
            password: "password123",
        };

        const response = await request(app)
            .post("/api/users/signup")
            .send(newUser)
            .expect(201);

        expect(response.body.message).toBe("User created successfully");
        
        const user = await db.query("SELECT * FROM users WHERE username = $1", [newUser.username]);
        expect(user.rows.length).toBe(1);
        expect(user.rows[0].username).toBe(newUser.username);
    });
    test("409: returns conflict error if username already exists", async () => {
        const duplicateUser = {
            username: "BabySpice",
            password: "password123",
        };

        const response = await request(app)
            .post("/api/users/signup")
            .send(duplicateUser)
            .expect(409);

        expect(response.body.message).toBe("Username already exists");
    });
});

describe('GET /api/users', () => {
    test.only('200: responds with an array of usernames', async () => {
        const expected = [
            "ScarySpice",
            "BabySpice",
            "PoshSpice",
            "GingerSpice",
            "SportySpice"
        ];
        
        const response = await request(app)
            .get('/api/users')
            .expect(200);

        expect(response.body.users.length).toBe(5);
        expect(response.body.users).toEqual(expect.arrayContaining(expected));
        response.body.users.forEach(() => expect.any(String));
    });
});

describe("GET /api/users/:username", () => {
    test("200: responds with user details for an existing user", async () => {
        const username = "ScarySpice";

        const response = await request(app)
            .get(`/api/users/${username}`)
            .expect(200);

        expect(response.body.user.username).toBe(username);
    });
    test("404: for non-existent user", async () => {
        const nonExistentUsername = "NonexistentUser";

        const response = await request(app)
            .get(`/api/users/${nonExistentUsername}`)
            .expect(404);

        expect(response.body.message).toBe("User not found");
    });
});

describe('DELETE /api/users/:username', () => {
    test('204: responds with a 204 for valid input', async () => {
        await request(app).delete("/api/users/PoshSpice").expect(204);

        const checkUserDeleted = await db.query(
            `SELECT 1 FROM users WHERE username = $1;`,
            ['PoshSpice']
        );
        expect(checkUserDeleted.rows).toEqual([]);
    });
    test("404: responds with a error if username does not exist", async () => {
        const { body } = await request(app)
            .delete("/api/users/SantaClaus")
            .expect(404);
        expect(body.msg).toBe("Not found");
    });
});