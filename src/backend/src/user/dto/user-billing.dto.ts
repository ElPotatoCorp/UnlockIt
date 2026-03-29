import { OmitType } from "@nestjs/swagger";
import { UserBilling } from "../entities/user-billing.entity";

export class UserBillingDto extends OmitType(UserBilling, ['userId', 'user'] as const) {
  public static fromEntity(entity: UserBilling | null) {
    if (!entity) {
      return null;
    }

    const dto = new UserBillingDto();

    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.postalCode = entity.postalCode;
    dto.city = entity.city;
    dto.country = entity.country;
    dto.addressLine1 = entity.addressLine1;
    dto.addressLine2 = entity.addressLine2;

    return dto;
  }
}