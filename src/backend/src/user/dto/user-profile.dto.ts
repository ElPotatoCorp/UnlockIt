import { OmitType } from "@nestjs/swagger";
import { UserProfile } from "../entities/user-profile.entity";

export class UserProfileDto extends OmitType(UserProfile, ['userId', 'user'] as const) {
  public static fromEntity(entity: UserProfile | null) {
    if (!entity) {
      return null;
    }

    const dto = new UserProfileDto();
    
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.birthdate = entity.birthdate;
    dto.country = entity.country;
    dto.newsletter = entity.newsletter;

    return dto;
  }
}