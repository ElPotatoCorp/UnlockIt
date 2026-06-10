import { IsString, IsStrongPassword, Length } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @Length(8)
  @IsStrongPassword()
  password: string;
}