import {test} from "../../src/fixtures/test.fixtures.js";
import {expect} from "@playwright/test";
import {VALID_BRANDS_RESPONSE_BODY} from "../../src/data/dictionaries/brands.js";
import {VALID_BRAND_MODELS_RESPONSE_BODY} from "../../src/data/dictionaries/brandModels.js";

test.describe('Update cars API', () => {

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

    test('should update existing car', async ({newUserAPIClient: client}) => {

        const newModelId = VALID_BRAND_MODELS_RESPONSE_BODY.data.filter(model => model.carBrandId === defaultUserCar.carBrandId)[1].id

        const requestBody = {
            'carBrandId': defaultUserCar.carBrandId,
            'carModelId': newModelId,
            'mileage': 155
        }


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

        const requestBody = {
            'carBrandId': defaultUserCar.carBrandId,
            'carModelId': defaultUserCar.carModelId,
            'mileage': 155
        }

        const response = await client.cars.updateUserCar(invalidCarId, requestBody)
        const body = response.data

        expect(response.status, 'Status code should be 404').toEqual(404)
        expect(body.status).toBe('error')
        expect(body.message).toBe('Car not found')
    })
})
