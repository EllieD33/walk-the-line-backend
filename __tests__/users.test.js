const app = require("../app");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");

require("pg").defaults.parseInt8 = true;

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET/api/user", () => {
    test("200 - responds with a 200 and returns a user object matching the criteria", async () => {
        const requestBody = { username: "Jonathan", password: "Jonathan" };
        const expectedResult = {
            id: 2,
            username: "Jonathan",
            password: "Jonathan",
        };
        const { body } = await request(app)
            .get("/api/user")
            .send(requestBody)
            .expect(200);

        expect(body.user).toEqual(expectedResult);
    });
});

describe("POST/api/user/login", () => {
    test("200 - responds with a 200 and returns a user object matching the criteria", async () => {
        const requestBody = { username: "Jonathan", password: "Jonathan" };

        const expectedResult = { id: 2, username: "Jonathan" };

        const { body } = await request(app)
            .post("/api/user/login")
            .send(requestBody)
            .expect(200);

        expect(body.user).toEqual(expectedResult);
    });
});
