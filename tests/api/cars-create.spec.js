import {test} from "../../src/fixtures/test.fixtures.js";
import {expect} from "@playwright/test";
import {VALID_BRANDS_RESPONSE_BODY} from "../../src/data/dictionaries/brands.js";
import {VALID_BRAND_MODELS_RESPONSE_BODY} from "../../src/data/dictionaries/brandModels.js";

test.describe('Create cars API', () => {

    test('should create new car', async ({testUserAPIClient: client}) => {
        const brandId = VALID_BRANDS_RESPONSE_BODY.data[0].id
        const modelId = VALID_BRAND_MODELS_RESPONSE_BODY.data.find(model => model.carBrandId === brandId).id

        const requestBody = {
            "carBrandId": brandId,
            "carModelId": modelId,
            "mileage": 155
        }

        const response = await client.cars.createUserCar(requestBody)
        const body = response.data

        expect(response.status, 'Status code should be 201').toEqual(201)
        expect(body.status).toBe('ok')
        expect(body.data, 'Response should have car data').toMatchObject(requestBody)
    })

    test('should be returned not found error for invalid brand id', async ({testUserAPIClient: client}) => {
        const brandId = 8888
        const modelId = 8888

        const requestBody = {
            "carBrandId": brandId,
            "carModelId": modelId,
            "mileage": 140
        }

        const response = await client.cars.createUserCar(requestBody)
        const body = response.data
        expect(response.status, 'Status code should be 404').toEqual(404)
        expect(body.status).toBe('error')
        expect(body.message).toBe('Brand not found')
    })

    test('should be returned not found error for invalid model id', async ({testUserAPIClient: client}) => {
        const brandId = VALID_BRANDS_RESPONSE_BODY.data[0].id
        const modelId = 9999

        const requestBody = {
            "carBrandId": brandId,
            "carModelId": modelId,
            "mileage": 150
        }

        const response = await client.cars.createUserCar(requestBody)
        const body = response.data

        expect(response.status, 'Status code should be 404').toEqual(404)
        expect(body.status).toBe('error')
        expect(body.message).toBe('Model not found')
    })
})
