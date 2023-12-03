import {test} from "../../src/fixtures/test.fixtures.js";
import {expect} from "@playwright/test";
import {VALID_BRAND_MODELS_RESPONSE_BODY} from "../../src/data/dictionaries/brandModels.js";

test.describe('Models API', () => {

    test('should return all car models', async ({testUserAPIClient: client}) => {
        const response = await client.cars.getCarModels()
        const body = response.data

        expect(response.status, 'Status code should be 200').toEqual(200)
        expect(body, 'Response should have correct car models').toMatchObject(VALID_BRAND_MODELS_RESPONSE_BODY)
    })

    test('should return car models for brand', async ({testUserAPIClient: client}) => {
        const brandId = VALID_BRAND_MODELS_RESPONSE_BODY.data[0].id
        const expectedModels = VALID_BRAND_MODELS_RESPONSE_BODY.data.filter(model => model.carBrandId === brandId)

        const response = await client.cars.getCarModelsByBrandId(brandId)
        const body = response.data

        expect(response.status, 'Status code should be 200').toEqual(200)
        expect(body.status, 'Response should have correct status').toBe('ok')
        expect(body.data, 'Response should have correct car models').toEqual(expectedModels)
    })

    test('should return not found error when brand does not exist', async ({testUserAPIClient: client}) => {
        const invalidBrandId = 999

        const response = await client.cars.getCarModelsByBrandId(invalidBrandId)
        const body = response.data

        expect(response.status, 'Status code should be 404').toEqual(404)
        expect(body.status, 'Response should have correct status').toBe('error')
        expect(body.message, 'Response should have correct error message').toBe('No car models found')
    })


    test('should return car model by id', async ({testUserAPIClient: client}) => {
        const expectedModel = VALID_BRAND_MODELS_RESPONSE_BODY.data[1]

        const response = await client.cars.getCarModelById(expectedModel.id)
        const body = response.data

        expect(response.status, 'Status code should be 200').toEqual(200)
        expect(body.status, 'Response should have correct status').toBe('ok')
        expect(body.data, 'Response should have correct car model').toEqual(expectedModel)
    })

    test('should return not found error when model does not exist', async ({testUserAPIClient: client}) => {
        const invalidModelId = 999

        const response = await client.cars.getCarModelById(invalidModelId)
        const body = response.data

        expect(response.status, 'Status code should be 404').toEqual(404)
        expect(body.status, 'Response should have correct status').toBe('error')
        expect(body.message, 'Response should have correct error message').toBe('No car models found with this id')
    })
})
