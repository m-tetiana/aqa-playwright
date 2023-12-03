import {faker} from "@faker-js/faker"
import BaseModel from "../BaseModel.js"

export default class SignUpModel extends BaseModel {
    constructor(data) {
        super(data)
    }

    setName(name) {
        this._data.name = name
        return this
    }

    setLastName(name) {
        this._data.name = name
        return this
    }

    static withRandomData() {
        const password = faker.internet.password({length: 12, prefix: 'AQa_123'})
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const email = 'AQA.' + faker.internet.email({firstName, lastName})

        return new SignUpModel({
            "name": firstName,
            "lastName": lastName,
            "email": email,
            "password": password,
            "repeatPassword": password
        })
    }
}
