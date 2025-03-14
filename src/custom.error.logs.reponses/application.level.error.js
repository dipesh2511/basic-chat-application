export default class ApplicationLevelError extends Error {
  constructor(message, status_code, error_message, error_type) {
    super(message);
    this.status_code = status_code;
    this.error_message = error_message;
    this.error_type = error_type;
  }

  static getErrorMessage(genericError) {
    return {
      status_code: genericError.status_code,
      error_message: genericError.error_message,
      error_type: genericError.error_type,
    };
  }
}
