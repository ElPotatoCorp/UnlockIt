import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDtoDoc } from 'src/docs/user/dto/update-user.dto.doc';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @UpdateUserDtoDoc.PhoneWzc()
    phoneWzc?: string;

    @UpdateUserDtoDoc.PhoneNumber()
    phoneNumber?: string;

    @UpdateUserDtoDoc.Bio()
    bio?: string;

    @UpdateUserDtoDoc.FirstName()
    firstName?: string;

    @UpdateUserDtoDoc.LastName()
    lastName?: string;

    @UpdateUserDtoDoc.Country()
    country?: string;

    @UpdateUserDtoDoc.BillingAddress()
    billingAddress?: string;

    @UpdateUserDtoDoc.NewsletterSubscribed()
    newsletterSubscribed?: boolean;

    @UpdateUserDtoDoc.BirthdayDate()
    birthdayDate?: string;
}
