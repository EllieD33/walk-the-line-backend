const app = require("../app");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");

require("pg").defaults.parseInt8 = true;

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/walks", () => {
    test("200: responds with a list of all walks", async () => {
        const response = await request(app).get("/api/walks").expect(200);
        expect(response.body.walks).toHaveLength(6);
        response.body.walks.forEach(() => expect.objectContaining({
            "walk_id": expect.any(Number),
            "username": expect.any(String),
            "creator_id": expect.any(Number),
            "title": expect.any(String),
            "description": expect.any(String),
            "distance_km": expect.any(Number),
            "ascent": expect.any(Number),
            "rating": expect.any(Number) || expect.toBeNull(),
            "difficulty": expect.stringMatching(/easy|moderate|challenging/) || expect.toBeNull(),
            "start_latitude": expect.any(Number),
            "start_longitude": expect.any(Number),
            "start_altitude": expect.any(Number),
        }))
    });
});

describe("GET /api/walks? ", () => {
    test("200: responds with a list of walks by creator", async () => {
        const { body } = await request(app)
            .get("/api/walks?creator_id=4")
            .expect(200);

        expect(body.walks).toHaveLength(3);
    });

    test("200: responds with a list of walks by difficulty", async () => {
        const { body } = await request(app)
            .get("/api/walks?difficulty=easy")
            .expect(200);

        expect(body.walks).toHaveLength(2);
    });

    test("200: responds with a list of walks by creator and difficulty", async () => {
        const { body } = await request(app)
            .get("/api/walks?creator_id=4&difficulty=moderate")
            .expect(200);

        expect(body.walks).toHaveLength(1);
    });

    test("200: responds with an empty array when none match criteria", async () => {
        const { body } = await request(app)
            .get("/api/walks?creator_id=2&difficulty=easy")
            .expect(200);

        expect(body.walks).toEqual([]);
    });

    test("200: responds with a list of walks >= minDistance ", async () => {
        const { body } = await request(app)
            .get("/api/walks?minDistance=10")
            .expect(200);

        expect(body.walks).toHaveLength(4);
    });

    test("200: responds with a list of walks <= maxDistance ", async () => {
        const { body } = await request(app)
            .get("/api/walks?maxDistance=10")
            .expect(200);

        expect(body.walks).toHaveLength(2);
    });

    test("200: responds with a list of walks within a distance range", async () => {
        const { body } = await request(app)
            .get("/api/walks?minDistance=10&maxDistance=20")
            .expect(200);

        expect(body.walks).toHaveLength(4);
    });

    test("200: responds with a list of walks when all criteria applied", async () => {
        const { body } = await request(app)
            .get(
                "/api/walks?creator_id=4&difficulty=moderate&minDistance=1&maxDistance=12"
            )
            .expect(200);

        expect(body.walks).toHaveLength(1);
    });

    test("400: responds with error when invalid query parameter is provided", async () => {
        const { body } = await request(app)
            .get("/api/walks?difficulty=124")
            .expect(400);

        expect(body.msg).toBe("Bad request");
    });
});

describe("GET /api/walks/:walk_id", () => {
    test("200: responds with a walk matching given walk id", async () => {
        const expectedResult = [
            {
                walk_id: 2,
                username: "GingerSpice",
                creator_id: 3,
                title: "Ogden Water",
                description: "It is always wet in Ogden.",
                distance_km: 5.55,
                ascent: 219.62,
                rating: null,
                difficulty: 'easy',
                start_latitude: 53.7743100,
                start_longitude: -1.9006900,
                start_altitude: 0.00,
            },
        ];

        const { body } = await request(app).get("/api/walks/2").expect(200);
        expect(body.walks).toEqual(expectedResult);
    });

    test('404: responds with error if walk doesnt exist', async () => {
        const { body } = await request(app)
            .get("/api/walks/9999999")
            .expect(404);

        expect(body.msg).toBe("Not found");
    });

    test('404: responds with error if invalid id type provided', async () => {
        const { body } = await request(app)
            .get("/api/walks/invalid")
            .expect(400);

        expect(body.msg).toBe("Bad request");
    });
});

describe("POST/api/walks", () => {
    test("201: responds with created walk", async () => {
        const requestBody = {
            walk: {
                creator_id: 1,
                title: "Bronte country 2",
                description:
                    "Haworth to Withins Heights with only start, middle and end locations.",
                distance_km: 11.72,
                ascent: 345.75,
                difficulty: null,
                start_latitude: 53.828946,
                start_longitude: -1.956974,
                start_altitude: 0,
            },
            locations: [
                { latitude: 53.828946, longitude: -1.956974, altitude: 0 },
                { latitude: 53.81686, longitude: -2.0214, altitude: 0 },
                { latitude: 53.828864, longitude: -1.957129, altitude: 0 },
            ],
        };

        const expectedResult = {
            walk: {
                walk_id: 7,
                creator_id: 1,
                title: "Bronte country 2",
                description:
                    "Haworth to Withins Heights with only start, middle and end locations.",
                distance_km: "11.72",
                ascent: "345.75",
                rating: null,
                difficulty: null,
                start_latitude: "53.8289460",
                start_longitude: "-1.9569740",
                start_altitude: "0.00",
            },
        };

        const response = await request(app)
            .post("/api/walks")
            .send(requestBody)
            .expect(201);
        expect(response.body).toEqual(expectedResult);
    });
    test('400: return error if no locations sent', async () => {
        const requestBody = {
            walk: {
                creator_id: 1,
                title: "Bronte country 2",
                description:
                    "Haworth to Withins Heights with only start, middle and end locations.",
                distance_km: 11.72,
                ascent: 345.75,
                difficulty: null,
                start_latitude: 53.828946,
                start_longitude: -1.956974,
                start_altitude: 0,
            },
            locations: []
        };

        const response = await request(app)
            .post("/api/walks")
            .send(requestBody)
            .expect(400);
        expect(response.body.msg).toEqual('Bad request');
    });
});

describe("DELETE /api/walks/:walk_id", () => {
    test("204: responds with a 204 for valid input", async () => {
        await request(app).delete("/api/walks/2").expect(204);

        const selectWalkResult = await db.query(
            `SELECT 1 FROM walks WHERE walk_id = $1;`,
            [2]
        );
        expect(selectWalkResult.rows).toEqual([]);

        const selectLocationsResult = await db.query(
            `SELECT 1 FROM walk_location_points WHERE walk_id = $1;`,
            [2]
        );
        expect(selectLocationsResult.rows).toEqual([]);
    });

    test("400: responds with error if invalid id type provided", async () => {
        const { body } = await request(app)
            .delete("/api/walks/BadIDType")
            .expect(400);
        expect(body.msg).toBe("Bad Request");
    });

    test("404: responds with a error if walk does not exist", async () => {
        const { body } = await request(app)
            .delete("/api/walks/7897688")
            .expect(404);
        expect(body.msg).toBe("Not Found");
    });
});
