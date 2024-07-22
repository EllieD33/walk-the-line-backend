const app = require('../app')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')
const request = require('supertest')
const seed = require('../db/seeds/seed')

require("pg").defaults.parseInt8 = true;

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/walklocationpoints/1", () => {
    test("200: responds with a list of walk location points for the given walk_id", async () => {
        const { body } = await request(app)
            .get("/api/walklocationpoints/1")
            .expect(200);
        expect(body.locationPoints).toHaveLength(100)
        body.locationPoints.forEach(point => {
            expect(point).toMatchObject({
                walk_id: expect.any(Number), 
                altitude: expect.any(Number), 
                latitude: expect.any(Number), 
                longitude: expect.any(Number), 
                location_point_id: expect.any(Number), 
                location_timestamp: expect.any(String), 
            });
        });
    });
    test('404: responds with an error for non-existent walk_id"', async () => {
        const { body } = await request(app)
            .get("/api/walklocationpoints/1000")
            .expect(404);
        expect(body.msg).toBe('Not found')
    });
    test('400: responds with an error for invalid walk_id"', async () => {
        const { body } = await request(app)
            .get("/api/walklocationpoints/twenty")
            .expect(400);
        expect(body.msg).toBe('Bad request')
    });
})