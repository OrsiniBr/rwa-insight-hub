import { Response } from 'express';
export default class ApiResponse<T> {
    private readonly timeStamp;
    private readonly success;
    private readonly statusCode;
    private readonly data;
    private readonly message;
    constructor(success: boolean, statusCode: number, data: T, message?: string);
    static success<T>(res: Response, data: T, statusCode?: number, message?: string): Response<any, Record<string, any>>;
    static error<T>(res: Response, statusCode: number | undefined, error: T, message?: string): Response<any, Record<string, any>>;
}
//# sourceMappingURL=apiResponse.d.ts.map