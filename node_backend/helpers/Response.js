
class Response {
    constructor(success = true, message = '', data = {}) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}

module.exports = Response;
