/**
 * 200 - Any request that succeeded
 * 400 - Client side malformed request
 * 401 - Client was not authenticated
 * 403 - Client was authenticated but not authorized
 * 409 - Business logic errors
 * 500 - Anything else not considered here
 */

const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

export { HTTP_CODES };
