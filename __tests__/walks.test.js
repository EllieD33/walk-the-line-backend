const app = require('../app')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')
const request = require('supertest')
const seed = require('../db/seeds/seed')

require("pg").defaults.parseInt8 = true;


beforeEach( () => {
    return seed(testData)
})

afterAll( () => {
    return db.end()
})


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

        const expectedResult = { walk: { id: 3,
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
        const expectedResult = [{   id: 1,
                                    creator_id: 1,
                                    title: 'Bronte country',
                                    description: 'Haworth to Withins Heights and back via Bronte Waterfalls and Bronte Bridge.',
                                    distance_km: "11.72",
                                    ascent: "345.75",
                                    rating: null, 
                                    difficulty:  null,
                                    start_latitude: "53.8289460",
                                    start_longitude: "-1.9569740",
                                    start_altitude: "0.00" 
                                },
                                {   id: 2,
                                    creator_id: 2,
                                    title: 'Ilkley Moor',
                                    description: 'Ilkley Moor - short and windy walk.',
                                    distance_km: "5.55",
                                    ascent: "219.62",
                                    rating: null, 
                                    difficulty:  null,
                                    start_latitude: "53.9166200",
                                    start_longitude: "-1.7998800",
                                    start_altitude: "0.00" 
                                }
                                ]

        const {body} = await request(app).get("/api/walks").expect(200)
        expect(body.walks).toEqual(expectedResult)
    })
})

describe("GET/api/walks/:creator_id", () => {
    test("200 - responds with a 200 and list of walks by creator_id", async () => {
        const expectedResult = [{   id: 2,
                                    creator_id: 2,
                                    title: 'Ilkley Moor',
                                    description: 'Ilkley Moor - short and windy walk.',
                                    distance_km: "5.55",
                                    ascent: "219.62",
                                    rating: null, 
                                    difficulty:  null,
                                    start_latitude: "53.9166200",
                                    start_longitude: "-1.7998800",
                                    start_altitude: "0.00" 
                                }
                                ]

        const {body} = await request(app).get("/api/walks/2").expect(200)
        expect(body.walks).toEqual(expectedResult)
    })
})