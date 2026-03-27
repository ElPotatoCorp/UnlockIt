import { PickType } from "@nestjs/swagger";
import { User } from "./user.entity";

const PUBLIC_USER_FIELDS = ['id', 'username', 'bio', 'avatar', 'creationDate'] as const;

export class PublicUser extends PickType(User, PUBLIC_USER_FIELDS) {
  public static fromUser(user: User): PublicUser {
    return Object.assign(new PublicUser(), Object.fromEntries(
      PUBLIC_USER_FIELDS.map(key => [key, user[key]])
    ));
  }
}