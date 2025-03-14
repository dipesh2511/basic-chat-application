export default class ApplicationLevelResponse {
  constructor(message, status_code, data) {
    this.message = message;
    this.status_code = status_code;
    this.data = data;
  }
}