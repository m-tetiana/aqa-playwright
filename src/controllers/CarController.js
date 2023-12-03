import BaseController from "./BaseController.js";

export default class CarController extends BaseController {
    #GET_USER_CARS_PATH = '/cars'
    #CREATE_USER_CAR_PATH = '/cars'
    #GET_USER_CAR_PATH = '/cars/#'
    #UPDATE_USER_CARS_PATH = '/cars/#'
    #DELETE_USER_CARS_PATH = '/cars/#'
    #GET_CAR_BRANDS_PATH = '/cars/brands'
    #GET_CAR_BRAND_PATH = '/cars/brands/#'
    #GET_CAR_MODELS_PATH = '/cars/models'
    #GET_CAR_MODEL_PATH = '/cars/models/#'

    constructor(options) {
        super(options)
    }

    async getUserCars() {
        return this._client.get(this.#GET_USER_CARS_PATH)
    }

    async createUserCar(data) {
        return this._client.post(this.#CREATE_USER_CAR_PATH, data)
    }

    async getUserCarById(id) {
        return this._client.get(this.#GET_USER_CAR_PATH.replace('#', id))
    }

    async updateUserCar(id, data) {
        return this._client.put(this.#UPDATE_USER_CARS_PATH.replace('#', id), data)
    }

    async deleteUserCar(id) {
        return this._client.delete(this.#DELETE_USER_CARS_PATH.replace('#', id))
    }

    async getCarBrands() {
        return this._client.get(this.#GET_CAR_BRANDS_PATH)
    }

    async getCarBrandById(id) {
        return this._client.get(this.#GET_CAR_BRAND_PATH.replace('#', id))
    }

    async getCarModels() {
        return this._client.get(this.#GET_CAR_MODELS_PATH)
    }

    async getCarModelsByBrandId(brandId) {
        return this._client.get(`${this.#GET_CAR_MODELS_PATH}?carBrandId=${brandId}`)
    }

    async getCarModelById(id) {
        return this._client.get(this.#GET_CAR_MODEL_PATH.replace('#', id))
    }
}
