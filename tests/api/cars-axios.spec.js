import {test} from "../../src/fixtures/test.fixtures.js";
import {expect} from "@playwright/test";
import {VALID_BRANDS_RESPONSE_BODY} from "../../src/data/dictionaries/brands.js";
import {VALID_BRAND_MODELS} from "../../src/data/dictionaries/brandModels.js";
import {USERS} from "../../src/data/dictionaries/users.js";
import {wrapper} from "axios-cookiejar-support";
import {config} from "../../config/config.js";
import {CookieJar} from "tough-cookie";
import axios from "axios";

test.describe("API", () => {
    let client

    test.beforeAll(async () => {
        const jar = new CookieJar();
        client = wrapper(axios.create({
            baseURL: config.apiURL,
            jar,
            validateStatus: status => {
                return status < 501
            }
        }))

        await client.post('/auth/signin', {
            "email": USERS.TEST_USER.email,
            "password": USERS.TEST_USER.password,
            "remember": false
        })
    })

    test('should create new car', async ({}) => {
        const brandId = VALID_BRANDS_RESPONSE_BODY.data[0].id
        const modelId = VALID_BRAND_MODELS[brandId].data[1].id

        const requestBody = {
            "carBrandId": brandId,
            "carModelId": modelId,
            "mileage": 150
        }

        const response = await client.post('/cars', requestBody)
        const body = await response.data
        expect(response.status, 'Status code should be 201').toEqual(201)
        expect(body.status).toBe('ok')
        expect(body.data, 'Car should be created with data from request').toMatchObject(requestBody)
    })

    test('should be returned not found error for invalid brand id', async ({}) => {
        const brandId = 8888
        const modelId = 8888

        const requestBody = {
            "carBrandId": brandId,
            "carModelId": modelId,
            "mileage": 140
        }

        const response = await client.post('/cars', requestBody)
        const body = await response.data
        expect(response.status, 'Status code should be 404').toEqual(404)
        expect(body.status).toBe('error')
        expect(body.message).toBe('Brand not found')
    })

    test('should be returned not found error for invalid model id', async ({}) => {
        const brandId = VALID_BRANDS_RESPONSE_BODY.data[0].id
        const modelId = 9999

        const requestBody = {
            "carBrandId": brandId,
            "carModelId": modelId,
            "mileage": 150
        }

        const response = await client.post('/cars', requestBody)
        const body = await response.data
        expect(response.status, 'Status code should be 404').toEqual(404)
        expect(body.status).toBe('error')
        expect(body.message).toBe('Model not found')
    })
})
