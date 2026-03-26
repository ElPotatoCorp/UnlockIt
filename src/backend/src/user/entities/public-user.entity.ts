import { OmitType } from "@nestjs/mapped-types";
import { User } from "./user.entity";

export class PublicUser extends OmitType(User, ['password', 'email', 'phoneWzc', 'phoneNumber', 'wallet', 'firstName', 'lastName', 'country', 'billingAddress', 'newsletterSubscribed', 'birthdayDate'] as const) {
}