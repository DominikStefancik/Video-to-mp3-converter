interface ValidationErrorDetail {
  message: string;
  type: string;
  field?: string;
  parameters?: { [key: string]: any };
}

export class ValidationError extends Error {
  public constructor(
    public readonly message: string,
    public readonly details: ValidationErrorDetail
  ) {
    super(message);
  }
}
