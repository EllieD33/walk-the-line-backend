const app = require('../app')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')
const request = require('supertest')
const seed = require('../db/seeds/seed')

require("pg").defaults.parseInt8 = true;

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("POST/api/walks", () => {
    test("201 - responds with 201 when trail created", async () => {
        const requestBody = {
            walk: {
                creator_id: 1,
                title: 'Bronte country 2',
                description: 'Haworth to Withins Heights with only start, middle and end locations.',
                distance_km: 11.72,
                ascent: 345.75,
                difficulty:  null,
                start_latitude: 53.8289460,
                start_longitude: -1.9569740,
                start_altitude: 0 
                },
            locations: [    {   latitude: 53.8289460, 
                                longitude: -1.9569740,
                                altitude: 0 
                            }, 
                            {   latitude: 53.8168600, 
                                longitude: -2.0214000,
                                altitude: 0
                            },
                            {   latitude: 53.8288640, 
                                longitude: -1.9571290,
                                altitude: 0
                            }
                        ]
            }

        const expectedResult = { walk: { id: 7,
                                        creator_id: 1,
                                        title: 'Bronte country 2',
                                        description: 'Haworth to Withins Heights with only start, middle and end locations.',
                                        distance_km: '11.72',
                                        ascent: '345.75',
                                        rating: null,
                                        difficulty: null,
                                        start_latitude: '53.8289460',
                                        start_longitude: '-1.9569740',
                                        start_altitude: '0.00'}
                                }
      

        const response  = await request(app).post("/api/walks").send(requestBody).expect(201)
        expect(response.body).toEqual(expectedResult)
    })
})

describe("GET/api/walks", () => {
    test("200 - responds with a 200 and list of walks", async () => {
        const {body} = await request(app).get("/api/walks").expect(200)
        expect(body.walks).toHaveLength(6)
    })
})

describe("GET/api/walks/2", () => {
    test("200 - responds with a 200 and list of walks by creator_id", async () => {
        const expectedResult = [
                                {   id: 1, 
                                    creator_id: 2,                                     
                                    username: 'Jonathan',
                                    title: 'Bronte country',
                                    description: 'Haworth to Withins Heights and back via Bronte Waterfalls and Bronte Bridge.',
                                    distance_km: "11.72",
                                    ascent: "345.75",
                                    rating: null, 
                                    difficulty:  "5",
                                    start_latitude: "53.8289460",
                                    start_longitude: "-1.9569740",
                                    start_altitude: "0.00" 
                                }
                                ]

        const {body} = await request(app).get("/api/walks/2").expect(200)
        expect(body.walks).toEqual(expectedResult)
    })
})

describe("GET/api/walks? - queries", () => {
    test("200 - responds with a 200 and list of walks by difficulty", async () => {
        const {body} = await request(app).get("/api/walks?difficulty=2").expect(200)
        expect(body.walks).toHaveLength(2)
    })

    test("200 - responds with a 200 and list of walks by creator and difficulty", async () => {
        const {body} = await request(app).get("/api/walks/4?difficulty=5").expect(200)  
        expect(body.walks).toHaveLength(1)
    })

    test("200 - responds with a 200 and empty array when none match criteria", async () => {
        const expectedResult = []

        const {body} = await request(app).get("/api/walks/1?difficulty=2").expect(200)  
        expect(body.walks).toEqual(expectedResult)
    })

    test("200 - responds with a 200 and list of walks >= minDistance ", async () => {
        const expectedResult = [{   id: 1,
                                    creator_id: 1,
                                    username: 'Anonymous',
                                    title: 'Bronte country',
                                    description: 'Haworth to Withins Heights and back via Bronte Waterfalls and Bronte Bridge.',
                                    distance_km: "11.72",
                                    ascent: "345.75",
                                    rating: null, 
                                    difficulty:  "5",
                                    start_latitude: "53.8289460",
                                    start_longitude: "-1.9569740",
                                    start_altitude: "0.00" 
                                }
                                ]

        const {body} = await request(app).get("/api/walks?minDistance=10").expect(200)  
        expect(body.walks).toHaveLength(4)
    })

    test("200 - responds with a 200 and list of walks <= maxDistance ", async () => {
        const expectedResult = [{   id: 2,
                                    creator_id: 2, 
                                    username: 'Jonathan',
                                    title: 'Ilkley Moor',
                                    description: 'Ilkley Moor - short and windy walk.',
                                    distance_km: "5.55",
                                    ascent: "219.62",
                                    rating: null, 
                                    difficulty:  "2",
                                    start_latitude: "53.9166200",
                                    start_longitude: "-1.7998800",
                                    start_altitude: "0.00" 
                                }
                                ]

        const {body} = await request(app).get("/api/walks?maxDistance=10").expect(200)  
        expect(body.walks).toHaveLength(2)
    })

    test("200 - responds with a 200 and list of walks when all criteria applied", async () => {
        const {body} = await request(app).get("/api/walks/4?difficulty=5&minDistance=1&maxDistance=12").expect(200)  
        expect(body.walks).toHaveLength(1)
    })
})


describe("DELETE/api/walk/:id", () => {
    test("400 - responds with a Bad Request if id is not an Integer", async () => {
        const {body}  = await request(app).delete("/api/walk/BadIDType").expect(400)
        expect(body.msg).toBe("Bad Request")
    })

    test("404 - responds with a 404 Not Found if id is not in DB", async () => {
        const {body}  = await request(app).delete("/api/walk/7897688").expect(404)
        expect(body.msg).toBe("Not Found")
    })

    test("204 - responds with a 204 for valid input", async () => {
        await request(app).delete("/api/walk/2").expect(204)

        const selectWalkResult = await db.query(`SELECT 1 FROM walks WHERE id = $1;`, [2])
        expect(selectWalkResult.rows).toEqual([])

        const selectLocationsResult = await db.query(`SELECT 1 FROM walk_location_points WHERE walk_id = $1;`, [2])
        expect(selectLocationsResult.rows).toEqual([])
    })
})