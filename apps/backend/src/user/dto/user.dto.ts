import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { IsUsername } from 'src/common/validators/username.validator';
import { ExactData, User } from '@unlockit/shared';

export class UserDto implements User {
  @UserEntityDoc.Id()
  @IsUUID(4)
  id: string;

  @UserEntityDoc.Username()
  @IsUsername()
  @Length(3, 50)
  username: string;

  @UserEntityDoc.Email()
  @IsEmail()
  @Length(5, 255)
  email: string;

  @UserEntityDoc.PhoneNumber()
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string | null;

  @UserEntityDoc.Bio()
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  bio: string | null;

  @UserEntityDoc.Avatar()
  @IsOptional()
  @IsString()
  @Length(0, 255)
  avatar: string | null;

  @UserEntityDoc.CreatedAt()
  @IsDateString()
  createdAt: Date;
}

const _assertExact: ExactData<User, UserDto> = true;
