import {test} from "../../src/fixtures/test.fixtures.js";
import {expect} from "@playwright/test";
import {VALID_BRANDS_RESPONSE_BODY} from "../../src/data/dictionaries/brands.js";
import {VALID_BRAND_MODELS_RESPONSE_BODY} from "../../src/data/dictionaries/brandModels.js";
import CreateCarModel from "../../src/models/cars/CreateCarModel.js";

test.describe('Create cars API', () => {

    let createdCarsIds = []

    test.afterEach(async ({testUserAPIClient: client}) => {
        for (const carId of createdCarsIds) {
            await client.cars.deleteUserCar(carId)
        }
    })

    test('should create new car', async ({testUserAPIClient: client}) => {
        const requestBody = CreateCarModel.withRandomData().extract()

        const response = await client.cars.createUserCar(requestBody)
        const body = response.data
        createdCarsIds.push(body.data.id)

        expect(response.status, 'Status code should be 201').toEqual(201)
        expect(body.status).toBe('ok')
        expect(body.data, 'Response should have car data').toMatchObject(requestBody)
    })

    test('should be returned not found error for invalid brand id', async ({testUserAPIClient: client}) => {
        const invalidBrandId = 8888
        const requestBody = CreateCarModel.withRandomData().withBrandId(invalidBrandId).extract()

        const response = await client.cars.createUserCar(requestBody)
        const body = response.data

        expect(response.status, 'Status code should be 404').toEqual(404)
        expect(body.status).toBe('error')
        expect(body.message).toBe('Brand not found')
    })

    test('should be returned not found error for invalid model id', async ({testUserAPIClient: client}) => {
        const invalidModelId = 9999
        const requestBody = CreateCarModel.withRandomData().withModelId(invalidModelId).extract()

        const response = await client.cars.createUserCar(requestBody)
        const body = response.data

        expect(response.status, 'Status code should be 404').toEqual(404)
        expect(body.status).toBe('error')
        expect(body.message).toBe('Model not found')
    })
})
