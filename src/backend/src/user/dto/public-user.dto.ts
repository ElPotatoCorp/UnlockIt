import { PickType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

const PUBLIC_USER_FIELDS = ['id', 'username', 'bio', 'avatar', 'creationDate'] as const;

export class PublicUserDto extends PickType(User, PUBLIC_USER_FIELDS) {
  public static fromUser(user: User): PublicUserDto {
    return Object.assign(new PublicUserDto(), Object.fromEntries(
      PUBLIC_USER_FIELDS.map(key => [key, user[key]])
    ));
  }
}