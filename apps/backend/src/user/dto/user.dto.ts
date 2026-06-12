import { UserEntity } from '../entities/user.entity';
import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';
import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
  Min,
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

  /*@UserEntityDoc.Wallet()
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @Min(0)
  wallet: number;*/

  @UserEntityDoc.CreatedAt()
  @IsDateString()
  createdAt: Date;

  public static fromEntity(user: UserEntity, privacy = true): UserDto {
    const dto = new UserDto();

    dto.id = user.id;
    dto.username = user.username;
    dto.email = privacy
      ? user.email.replace(/(.{2}).+(@.+)/, '$1***$2')
      : user.email;
    dto.phoneNumber = user.phoneNumber;
    dto.bio = user.bio;
    dto.avatar = user.avatar;
    dto.createdAt = user.createdAt;

    return dto;
  }
}

const _assertExact: ExactData<User, UserDto> = true;
