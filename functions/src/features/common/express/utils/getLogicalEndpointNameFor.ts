import { Result, err, ok } from 'neverthrow';
import { Logger } from 'winston';

export type APIEndPoint = 'ListFoos' | 'CreateFoo' | 'ReadFoo' | 'UpdateFoo' | 'DeleteFoo';

/**
 * Use a data structure to store a method, regex for a path and a logical endpoint to map an incoming
 * request to a logical endpoint
 */
const urlToEndPoint: { method: string; pathRegex: RegExp; logicalEndpoint: APIEndPoint }[] = [
  // Users
  { method: 'get', pathRegex: /\/v1\/foo$/, logicalEndpoint: 'ListFoos' },
  { method: 'post', pathRegex: /\/v1\/foo$/, logicalEndpoint: 'CreateFoo' },

  { method: 'get', pathRegex: /\/v1\/foo\/.*$/, logicalEndpoint: 'ReadFoo' },
  { method: 'patch', pathRegex: /\/v1\/foo\/.*$/, logicalEndpoint: 'UpdateFoo' },
  { method: 'delete', pathRegex: /\/v1\/foo\/.*$/, logicalEndpoint: 'DeleteFoo' },
];

/**
 * Find the logical endpoint requested from a specific API request.
 * This needs to match both the request path as well as the request method so
 * we can distinguish logical action e.g.
 * GET /users  => Get all users
 * POST /users => Create a user
 *
 * @param req
 */
export function getLogicalEndpointNameFor(
  method: string,
  path: string,
  parentLogger: Logger,
): Result<APIEndPoint, false> {
  parentLogger.debug(`Extracting logical endpoint from method ${method}, path: ${path}`);
  const lowercaseMethod = method.toLocaleLowerCase();
  const lowercasePath = path.toLocaleLowerCase();

  for (const matcher of urlToEndPoint) {
    if (matcher.pathRegex.exec(lowercasePath) && matcher.method === lowercaseMethod) {
      return ok(matcher.logicalEndpoint);
    }
  }

  return err(false);
}
