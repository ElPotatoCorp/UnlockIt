import { UserDto } from "./dto/user.dto";
import { PublicUserDto } from "./dto/public-user.dto";
import { UserBillingDto } from "./dto/user-billing.dto";
import { UserProfileDto } from "./dto/user-profile.dto";
import { UserEntity } from "./entities/user.entity";
import { UserProfileEntity } from "./entities/user-profile.entity";
import { UserBillingEntity } from "./entities/user-billing.entity";

export class UserMapper {
  static toUser(user: UserEntity) {
    const dto = new UserDto();

    dto.id = user.id;
    dto.username = user.username;
    dto.email = user.email.replace(/(.{2}).+(@.+)/, '$1***$2');
    dto.phoneNumber = user.phoneNumber;
    dto.bio = user.bio;
    dto.avatar = user.avatar;
    dto.createdAt = user.createdAt;

    return dto;
  }

  static toPublic(user: UserEntity) {
    const dto = new PublicUserDto();

    dto.id = user.id;
    dto.username = user.username;
    dto.bio = user.bio;
    dto.avatar = user.avatar;
    dto.createdAt = user.createdAt;

    return dto;
  }

  static toProfile(userProfile: UserProfileEntity | null) {
    if (!userProfile) {
      return null;
    }

    const dto = new UserProfileDto();

    dto.firstName = userProfile.firstName;
    dto.lastName = userProfile.lastName;
    dto.birthdate = userProfile.birthdate;
    dto.country = userProfile.country;
    dto.newsletter = userProfile.newsletter;

    return dto;
  }

  static toBilling(userBilling: UserBillingEntity | null) {
    if (!userBilling) {
      return null;
    }

    const dto = new UserBillingDto();

    dto.firstName = userBilling.firstName;
    dto.lastName = userBilling.lastName;
    dto.postalCode = userBilling.postalCode;
    dto.city = userBilling.city;
    dto.country = userBilling.country;
    dto.addressLine1 = userBilling.addressLine1;
    dto.addressLine2 = userBilling.addressLine2;

    return dto;
  }
}