import { ExactData, ResetPassword } from "@unlockit/shared";
import { IsString, IsStrongPassword, Length } from "class-validator";

export class ResetPasswordDto implements ResetPassword {
  @IsString()
  @Length(8)
  @IsStrongPassword()
  password: string;
}

const _assertExact: ExactData<ResetPassword, ResetPasswordDto> = true;