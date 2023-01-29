class HttpError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  public json(): { [key: string]: string | undefined } {
    const errorData: { name: string; message: string; stack?: string } = {
      name: this.name,
      message: this.message,
      stack: this.stack,
    };

    return errorData;
  }
}

class ResponseMessageError extends HttpError {
  public constructor(message?: string, public readonly responseMessage?: string) {
    super(message);
  }

  public json(): { [key: string]: string | undefined } {
    const errorData = super.json();
    errorData.responseMessage = this.responseMessage;

    return errorData;
  }
}

export class InternalServerError extends HttpError {}

export class AuthenticationError extends HttpError {}

export class AuthorizationError extends HttpError {}

export class InvalidRequestError extends ResponseMessageError {}

export class NotFoundError extends ResponseMessageError {}
