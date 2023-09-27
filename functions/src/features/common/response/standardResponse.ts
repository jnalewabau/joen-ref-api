// Standard HTTP response code values
export const HTTP_SUCCESS_CODE = 200;
export const HTTP_CREATED_CODE = 201;
export const HTTP_NO_CONTENT_CODE = 204;
export const HTTP_BAD_REQUEST_CODE = 400;
export const HTTP_UNAUTHORIZED_CODE = 401;
export const HTTP_NOT_FOUND_CODE = 404;
export const HTTP_CONFLICT_CODE = 409;
export const HTTP_INTERNAL_SERVER_ERROR_CODE = 500;

export type ResponseCode = 200 | 201 | 204 | 400 | 401 | 404 | 409 | 500;

export class StandardResponse<T> {
  constructor(
    public success: boolean,
    public code: ResponseCode,
    public message: string | undefined,
    public data?: T,
    public internalDetails?: {
      cid: string;
      internalMessage: string;
    },
  ) {
    // Set a standard message if none is provided
    if (message === undefined) {
      switch (code) {
        case HTTP_SUCCESS_CODE:
          this.message = 'Success';
          break;
        case HTTP_CREATED_CODE:
          this.message = 'Created';
          break;
        case HTTP_NO_CONTENT_CODE:
          this.message = 'No content';
          break;
        case HTTP_BAD_REQUEST_CODE:
          this.message = 'Bad request';
          break;
        case HTTP_UNAUTHORIZED_CODE:
          this.message = 'Unauthorized';
          break;
        case HTTP_NOT_FOUND_CODE:
          this.message = 'Not found';
          break;
        case HTTP_CONFLICT_CODE:
          this.message = 'Conflict';
          break;

        case HTTP_INTERNAL_SERVER_ERROR_CODE:
          this.message = 'Internal server error';
          break;

        default:
          this.message = 'No message provided';
          break;
      }
    }
  }
}
