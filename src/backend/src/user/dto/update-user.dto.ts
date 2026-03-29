import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, Length, Matches } from "class-validator";
import { UserEntityDoc } from "src/docs/user/entities/user.entity.doc";

export class UpdateUserDto {
  @UserEntityDoc.Username(false)
  @IsOptional() @IsString() @Length(3, 50) @Matches(/^[a-zA-Z0-9_]+$/)
  username?: string;

  @UserEntityDoc.Password(false)
  @IsOptional() @IsString() @IsStrongPassword() @Length(8, 128)
  password?: string;

  @UserEntityDoc.Email(false)
  @IsOptional() @IsString() @IsEmail() @Length(5, 255)
  email?: string;

  @UserEntityDoc.PhoneNumber()
  @IsOptional() @IsPhoneNumber()
  phoneNumber?: string;

  @UserEntityDoc.Bio()
  @IsOptional() @IsString() @Length(0, 1000)
  bio?: string;
}