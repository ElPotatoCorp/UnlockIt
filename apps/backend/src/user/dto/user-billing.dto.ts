import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';
import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { ExactData, UserBilling } from '@unlockit/shared';

export class UserBillingDto implements UserBilling {
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

const _assertExact: ExactData<UserBilling, UserBillingDto> = true;
