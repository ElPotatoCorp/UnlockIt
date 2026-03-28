import { ApiProperty } from "@nestjs/swagger";

export class JwtPayloadDto {
  @ApiProperty({
    description: 'The unique identifier of the user (UUID)',
  })
  sub: string; // subject (user id)
  @ApiProperty({
    description: 'The session identifier',
  })
  sid: string; // sessionId
  @ApiProperty({
    description: 'The timestamp when the token was issued',
  })
  iat: number; // issued at
  @ApiProperty({
    description: 'The timestamp when the token expires',
  })
  exp: number; // expiration time
}