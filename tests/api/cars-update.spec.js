import {test} from "../../src/fixtures/test.fixtures.js";
import {expect} from "@playwright/test";
import {VALID_BRANDS_RESPONSE_BODY} from "../../src/data/dictionaries/brands.js";
import {VALID_BRAND_MODELS_RESPONSE_BODY} from "../../src/data/dictionaries/brandModels.js";
import CreateCarModel from "../../src/models/cars/CreateCarModel.js";
import UpdateCarModel from "../../src/models/cars/UpdateCarModel.js";

test.describe('Update cars API', () => {

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

    test('should update existing car', async ({newUserAPIClient: client}) => {
        const requestBody = UpdateCarModel.withRandomData(defaultUserCar.mileage).extract()

        const response = await client.cars.updateUserCar(defaultUserCar.id, requestBody)
        const body = response.data

        const expectedResponseBody = {
            id: defaultUserCar.id,
            initialMileage: defaultUserCar.mileage,
            carCreatedAt: defaultUserCar.carCreatedAt,
            ...requestBody
        }

        expect(response.status, 'Status code should be 200').toEqual(200)
        expect(body.status).toBe('ok')
        expect(body.data, 'Should have an updated car data').toMatchObject(expectedResponseBody)
    })


    test('should be returned not found error when trying to update not existing car', async ({testUserAPIClient: client}) => {
        const invalidCarId = 999999
        const requestBody = UpdateCarModel.withRandomData(defaultUserCar.mileage).extract()

        const response = await client.cars.updateUserCar(invalidCarId, requestBody)
        const body = response.data

        expect(response.status, 'Status code should be 404').toEqual(404)
        expect(body.status).toBe('error')
        expect(body.message).toBe('Car not found')
    })
})
