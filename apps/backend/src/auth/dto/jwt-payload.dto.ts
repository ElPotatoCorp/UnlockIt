import { ApiProperty } from '@nestjs/swagger';
import { JwtPayload } from '@unlockit/shared';

export class JwtPayloadDto implements JwtPayload {
  @ApiProperty({
    description: 'The unique identifier of the user (UUID)',
  })
  sub: string;

  @ApiProperty({
    description: 'The session identifier',
  })
  sid: string;

  @ApiProperty({
    description: 'The timestamp when the token was issued',
  })
  iat: number;

  @ApiProperty({
    description: 'The timestamp when the token expires',
  })
  exp: number;
}
