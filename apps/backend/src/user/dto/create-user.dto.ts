import { IsEmail, IsString, IsStrongPassword, Length } from "class-validator";
import { IsUsername } from "src/common/validators/username.validator";
import { UserEntityDoc } from "src/docs/user/entities/user.entity.doc";

export class CreateUserDto {
  @UserEntityDoc.Username()
  @IsUsername() @Length(3, 50)
  username: string;

  @UserEntityDoc.Password()
  @IsString() @IsStrongPassword() @Length(8, 128)
  password: string;

  @UserEntityDoc.Email(false)
  @IsString() @IsEmail() @Length(5, 255)
  email: string;
}