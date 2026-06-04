import { ApiProperty } from '@nestjs/swagger';
import { EmployeeRole, JwtPayload } from '@unlockit/shared';

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

  @ApiProperty({
    description: 'The permission level of the user',
    enum: EmployeeRole,
    enumName: 'EmployeeRole',
    default: null,
    example: EmployeeRole.ADMIN,

    nullable: true,
    required: false,
  })
  permission: EmployeeRole | null;
}
