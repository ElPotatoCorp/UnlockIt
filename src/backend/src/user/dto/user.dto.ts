import { OmitType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class UserDto extends OmitType(User, ['password', 'profile', 'billing'] as const) {
  public static fromEntity(user: User, privacy = true): UserDto {
    const dto = new UserDto();

    dto.id               = user.id;
    dto.username         = user.username;
    dto.email            = privacy && user.email
      ? user.email.replace(/(.{2}).+(@.+)/, '$1***$2')
      : user.email;
    dto.phoneCountryCode = user.phoneCountryCode;
    dto.phoneNumber      = user.phoneNumber;
    dto.bio              = user.bio;
    dto.avatar           = user.avatar;
    dto.wallet           = user.wallet;
    dto.createdAt        = user.createdAt;

    return dto;
  }
}