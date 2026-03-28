export interface JwtPayload {
  sub: string; // subject (user id)
  sid: string; // sessionId
  iat: number; // issued at
  exp: number; // expiration time
}