const app = require('../app')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')
const request = require('supertest')
const seed = require('../db/seeds/seed')

require("pg").defaults.parseInt8 = true;

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET/api/walklocationpoints/1", () => {
    test("200 - responds with a 200 and list of walk location points for the given walk_id", async () => {
        const {body} = await request(app).get("/api/walklocationpoints/1").expect(200)
        expect(body.locationPoints).toHaveLength(100)
    })
})