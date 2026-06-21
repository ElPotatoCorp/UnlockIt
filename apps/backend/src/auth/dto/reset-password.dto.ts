import { ApiProperty } from '@nestjs/swagger';
import { ExactData, ResetPassword } from '@unlockit/shared';
import { IsString, IsStrongPassword, Length } from 'class-validator';

export class ResetPasswordDto implements ResetPassword {
  @ApiProperty({
    title: 'New Password',
    type: String,
    format: 'password',
    minLength: 8,
    example: 'Str0ng!Pass',
  })
  @IsString()
  @Length(8)
  @IsStrongPassword()
  password: string;
}

const _assertExact: ExactData<ResetPassword, ResetPasswordDto> = true;
