export type JwtPayload = {
  /** @summary Subject (user id) */
  sub: string;

  /** @summary Session id */
  sid: string;

  /** @summary Issued at */
  iat: number;

  /** @summary Expiration time */
  exp: number;
};