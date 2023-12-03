import {faker} from "@faker-js/faker"
import BaseModel from "../BaseModel.js"
import {VALID_BRANDS_RESPONSE_BODY} from "../../data/dictionaries/brands.js"
import {VALID_BRAND_MODELS_RESPONSE_BODY} from "../../data/dictionaries/brandModels.js"

export default class UpdateCarModel extends BaseModel {
    constructor({carBrandId, carModelId, mileage}) {
        super({carBrandId, carModelId, mileage})
    }

    withBrandId(id) {
        this._data.carBrandId = id
        return this
    }

    withModelId(id) {
        this._data.carModelId = id
        return this
    }

    withMillage(millage) {
        this._data.mileage = millage
        return this
    }

    static withRandomData(initialMillage = 1) {
        const carBrandId = faker.helpers.arrayElement(VALID_BRANDS_RESPONSE_BODY.data).id
        const carModelId = faker.helpers.arrayElement(VALID_BRAND_MODELS_RESPONSE_BODY.data.filter(model => model.carBrandId === carBrandId)).id

        return new UpdateCarModel({
            carBrandId,
            carModelId,
            mileage: faker.number.int({min: initialMillage, max: 1000000})
        })
    }
}
