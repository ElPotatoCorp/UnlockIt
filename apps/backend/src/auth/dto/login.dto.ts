import { ApiProperty } from '@nestjs/swagger';
import { ExactData, Login } from '@unlockit/shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto implements Login {
  @ApiProperty({
    title: 'Identifier',
    description:
      'This is an identifier, basically a unique field. It can either be an email or a username',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({
    title: 'Password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

const _assertExact: ExactData<Login, LoginDto> = true;
