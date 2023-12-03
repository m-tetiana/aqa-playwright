import {test} from "../../src/fixtures/test.fixtures.js";
import {expect} from "@playwright/test";
import {VALID_BRANDS_RESPONSE_BODY} from "../../src/data/dictionaries/brands.js";
import {VALID_BRAND_MODELS_RESPONSE_BODY} from "../../src/data/dictionaries/brandModels.js";
import CreateCarModel from "../../src/models/cars/CreateCarModel.js";

test.describe('Delete cars API', () => {

    let defaultUserCar

    test.beforeEach(async ({newUserAPIClient: client}) => {
        const requestBody = CreateCarModel.withRandomData().extract()
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

    test('should delete a user car', async ({newUserAPIClient: client}) => {
        const response = await client.cars.deleteUserCar(defaultUserCar.id)
        const body = response.data

        expect(response.status, 'Status code should be 200').toEqual(200)
        expect(body.status).toBe('ok')
        expect(body.data, 'Should have an id of deleted car').toMatchObject({carId: defaultUserCar.id})
    })

    test('should return not found error when car does not exist', async ({newUserAPIClient: client}) => {
        const invalidCarId = 999999

        const response = await client.cars.deleteUserCar(invalidCarId)
        const body = response.data

        expect(response.status, 'Status code should be 404').toEqual(404)
        expect(body.status).toBe('error')
        expect(body.message, 'Should have a correct error message').toBe('Car not found')
    })
})
