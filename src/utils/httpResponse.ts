import _ from 'lodash';
import { STATUS_CODES } from 'http';


type ErrorObject = { message: string; [key: string]: unknown }; 
type ErrorType = string | ErrorObject;

class HttpResponse {
    private timeStamp: string;
    private statusCode?: number;
    private status?: string;
    private message?: string;
    private data?: object;
    private errors: ErrorType[];

    constructor() {
        this.timeStamp = new Date().toISOString();
        this.errors = [];
    }

    withStatusCode(statusCode: number): HttpResponse {
        this.statusCode = statusCode;
        this.status = STATUS_CODES[statusCode];
        return this;
    }

    withMessage(message: string): HttpResponse {
        this.message = message;
        return this;
    }

    withData(data: object): HttpResponse {
        this.data = data;
        return this;
    }

    addError(errors: ErrorType | ErrorType[]): HttpResponse {
        if (Array.isArray(errors)) {
            this.errors.push(...errors);
        } else {
            this.errors.push(errors);
        }
        return this;
    }

    build(): Partial<HttpResponse> {
        if (this.errors.length === 0) {
            delete this.errors;
        }
        return _.omitBy(this, _.isNil);
    }
}

export default HttpResponse;
