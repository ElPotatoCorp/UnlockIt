import { UserEntityDoc } from "src/docs/user/entities/user.entity.doc";

export class UpdateUserDto {
  @UserEntityDoc.Username(false)
  username?: string;

  @UserEntityDoc.Password(false)
  password?: string;

  @UserEntityDoc.Email(false)
  email?: string;

  @UserEntityDoc.PhoneCountryCode()
  phoneCountryCode?: string;

  @UserEntityDoc.PhoneNumber()
  phoneNumber?: string;

  @UserEntityDoc.Bio()
  bio?: string;
}