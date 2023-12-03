import {test} from "../../src/fixtures/test.fixtures.js";
import {expect} from "@playwright/test";
import {VALID_BRANDS_RESPONSE_BODY} from "../../src/data/dictionaries/brands.js";

test.describe('Brands API', () => {

    test('should return all car brands', async ({testUserAPIClient: client}) => {
        const response = await client.cars.getCarBrands()
        const body = response.data

        expect(response.status, 'Status code should be 200').toEqual(200)
        expect(body, 'Response should have correct car brands').toEqual(VALID_BRANDS_RESPONSE_BODY)
    })

    test('should return car brand by id', async ({testUserAPIClient: client}) => {
        const expectedBrand = VALID_BRANDS_RESPONSE_BODY.data[1]

        const response = await client.cars.getCarBrandById(expectedBrand.id)
        const body = response.data

        expect(response.status, 'Status code should be 200').toEqual(200)
        expect(body.status, 'Response should have correct status').toBe('ok')
        expect(body.data, 'Response should have correct car brand').toEqual(expectedBrand)
    })

    test('should return not found error when brand does not exist', async ({testUserAPIClient: client}) => {
        const invalidBrandId = 999

        const response = await client.cars.getCarBrandById(invalidBrandId)
        const body = response.data

        expect(response.status, 'Status code should be 404').toEqual(404)
        expect(body.status, 'Response should have correct status').toBe('error')
        expect(body.message, 'Response should have correct error message').toBe('No car brands found with this id')
    })
})
