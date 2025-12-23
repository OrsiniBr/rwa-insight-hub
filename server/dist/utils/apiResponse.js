"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiResponse {
    constructor(success, statusCode, data, message) {
        this.timeStamp = new Date();
        this.success = success;
        this.data = data;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
    static success(res, data, statusCode = 200, message) {
        return res.status(statusCode).json(new ApiResponse(true, statusCode, data, message));
    }
    static error(res, statusCode = 400, error, message) {
        return res.status(statusCode).json(new ApiResponse(false, statusCode, error, message));
    }
}
exports.default = ApiResponse;
//# sourceMappingURL=apiResponse.js.map