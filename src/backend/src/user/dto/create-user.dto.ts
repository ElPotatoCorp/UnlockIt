import { IsEmail, IsString, IsStrongPassword, Length, Matches } from "class-validator";
import { UserEntityDoc } from "src/docs/user/entities/user.entity.doc";

export class CreateUserDto {
  @UserEntityDoc.Username()
  @IsString() @Length(3, 50) @Matches(/^[a-zA-Z0-9_]+$/)
  username: string;

  @UserEntityDoc.Password()
  @IsString() @IsStrongPassword() @Length(8, 128)
  password: string;

  @UserEntityDoc.Email(false)
  @IsString() @IsEmail() @Length(5, 255)
  email: string;
}