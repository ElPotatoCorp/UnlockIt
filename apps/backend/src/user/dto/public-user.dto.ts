import { PickType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

const PUBLIC_FIELDS = ['id', 'username', 'bio', 'avatar', 'createdAt'] as const;

export class PublicUserDto extends PickType(User, PUBLIC_FIELDS) {
  static fromEntity(user: User): PublicUserDto {
    const dto = new PublicUserDto();
    for (const key of PUBLIC_FIELDS) {
      (dto as any)[key] = user[key];
    }
    return dto;
  }
}
