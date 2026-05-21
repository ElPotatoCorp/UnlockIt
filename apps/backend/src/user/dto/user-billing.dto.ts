import { UserBilling } from '../entities/user-billing.entity';
import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class UserBillingDto {
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

  @UserEntityDoc.FirstName()
  @IsString()
  @Length(1, 100)
  firstName: string;

  @UserEntityDoc.LastName()
  @IsString()
  @Length(1, 100)
  lastName: string;

  @UserEntityDoc.Country()
  @IsString()
  @Matches(/^[A-Z]{2}$/)
  country: string;

  @UserEntityDoc.City()
  @IsString()
  @Length(1, 100)
  city: string;

  @UserEntityDoc.PostalCode()
  @IsString()
  @Length(1, 20)
  postalCode: string;

  @UserEntityDoc.AddressLine1()
  @IsString()
  @Length(1, 255)
  addressLine1: string;

  @UserEntityDoc.AddressLine2()
  @IsOptional()
  @IsString()
  @Length(1, 255)
  addressLine2: string | null;
}
