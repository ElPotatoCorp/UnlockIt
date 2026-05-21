import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { IsUsername } from 'src/common/validators/username.validator';
import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';

export class UpdateUserDto {
  @UserEntityDoc.Username(false)
  @IsOptional()
  @IsUsername()
  @Length(3, 50)
  username?: string;

  @UserEntityDoc.Password(false)
  @IsOptional()
  @IsString()
  @IsStrongPassword()
  @Length(8, 128)
  password?: string;

  @UserEntityDoc.Email(false)
  @IsOptional()
  @IsString()
  @IsEmail()
  @Length(5, 255)
  email?: string;

  @UserEntityDoc.PhoneNumber()
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @UserEntityDoc.Bio()
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  bio?: string;
}
