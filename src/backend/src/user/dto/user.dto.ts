import { OmitType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class UserDto extends OmitType(User, ['password'] as const) {
  public static fromUser(user: User, privacy: boolean = true): UserDto {
    const { password, ...userDto } = user; // Exclude password

    if (privacy) {
      userDto.email = userDto.email?.replace(/(.{2}).+(@.+)/, '$1***$2') ?? null; // Mask email for privacy
    }

    return Object.assign(new UserDto(), userDto);
  }
}