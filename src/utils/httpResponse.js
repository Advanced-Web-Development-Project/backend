const _ = require('lodash');
const http = require('http');

class HttpResponse {
  constructor() {
    this.timeStamp = new Date().toISOString();
    this.errors = []; // Initialize errors as an array
  }

  withStatusCode(statusCode) {
    this.statusCode = statusCode;
    this.status = http.STATUS_CODES[statusCode];
    return this;
  }

  withMessage(message) {
    this.message = message;
    return this;
  }

  withData(data) {
    this.data = data;
    return this;
  }

  addError(errors) {
    if (Array.isArray(errors)) {
      this.errors.push(...errors);
    } else if (errors) {
      this.errors.push(errors);
    }
    return this;
  }

  build() {
    if (this.errors.length === 0) {
      delete this.errors; // Remove the errors field if empty
    }
    return _.omitBy(this, _.isNil);
  }
}

module.exports = HttpResponse;
