/**
 * Base interface inherited by every response body the API returns. It is empty
 * today, but giving all responses a common supertype lets shared networking
 * code refer to "a response" generically and documents intent at each DTO.
 */
export interface Response {}

/** Returned by endpoints that only acknowledge success (e.g. DELETE). */
export interface MessageResponse extends Response {
  message: string;
}

/** Returned with a non-2xx status whenever a request fails. */
export interface ErrorResponse extends Response {
  error: string;
}
