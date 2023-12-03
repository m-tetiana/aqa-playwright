import AuthController from "../controllers/AuthController.js";
import CarController from "../controllers/CarController.js";
import {CookieJar} from "tough-cookie";
import {config} from "../../config/config.js";
import UserController from "../controllers/UserController.js";

export default class APIClient {
    constructor(options) {
        this.auth = new AuthController(options)
        this.users = new UserController(options)
        this.cars = new CarController(options)
    }

    static async authenticate(userData, options = {baseUrl: config.apiURL}){
        const jar = new CookieJar()
        const params = {...options, cookies: jar}
        const authController = new AuthController(params)
        await authController.signIn(userData)
        return new APIClient(params)
    }
}
