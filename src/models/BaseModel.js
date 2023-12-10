export default class BaseModel {

    constructor(data) {
        this._data = data
    }

    extract() {
        return structuredClone(this._data)
    }

}