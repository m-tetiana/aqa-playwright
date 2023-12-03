import {test} from "../../src/fixtures/test.fixtures.js";
import {expect} from "@playwright/test";
import {VALID_BRANDS_RESPONSE_BODY} from "../../src/data/dictionaries/brands.js";
import {VALID_BRAND_MODELS_RESPONSE_BODY} from "../../src/data/dictionaries/brandModels.js";

test.describe('Get cars API', () => {

    let defaultUserCar

    test.beforeEach(async ({newUserAPIClient: client}) => {
        const brandId = VALID_BRANDS_RESPONSE_BODY.data[0].id
        const modelId = VALID_BRAND_MODELS_RESPONSE_BODY.data.find(model => model.carBrandId === brandId).id

        const requestBody = {
            'carBrandId': brandId,
            'carModelId': modelId,
            'mileage': 122
        }

        const createResponse = await client.cars.createUserCar(requestBody)

        //Create car returns not rounded dates, but get endpoints return dates with 000 millis
        //(carCreatedAt: "2023-12-02T20:32:10.158Z" vs carCreatedAt: "2023-12-02T20:32:10.000Z")
        //So added this retrieving
        const getResponse = await client.cars.getUserCarById(createResponse.data.data.id)
        defaultUserCar = getResponse.data.data
    })

    test.afterEach(async ({newUserAPIClient: client}) => {
        await client.cars.deleteUserCar(defaultUserCar.id)
    })

    test('should return all user cars', async ({newUserAPIClient: client}) => {
        const response = await client.cars.getUserCars()
        const body = response.data

        expect(response.status, 'Status code should be 200').toEqual(200)
        expect(body.status).toBe('ok')
        expect(body.data, 'Should have a list of user cars').toEqual([defaultUserCar])
    })

    test('should return user car by id', async ({newUserAPIClient: client}) => {
        const response = await client.cars.getUserCarById(defaultUserCar.id)
        const body = response.data

        expect(response.status, 'Status code should be 200').toEqual(200)
        expect(body.status).toBe('ok')
        expect(body.data, 'Should have a car data').toEqual(defaultUserCar)
    })

    test('should not found error when car does not exist', async ({newUserAPIClient: client}) => {
        const invalidCarId = 9999999
        const response = await client.cars.getUserCarById(invalidCarId)
        const body = response.data

        expect(response.status, 'Status code should be 404').toEqual(404)
        expect(body.status).toBe('error')
        expect(body.message, 'Should have correct error message').toBe('Car not found')
    })
})
