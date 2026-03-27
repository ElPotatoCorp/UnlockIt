import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UserEntityDoc } from 'src/docs/user/entities/user.entity.doc';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @UserEntityDoc.PhoneWzc()
    phoneWzc?: string;

    @UserEntityDoc.PhoneNumber()
    phoneNumber?: string;

    @UserEntityDoc.Bio()
    bio?: string;

    @UserEntityDoc.FirstName()
    firstName?: string;

    @UserEntityDoc.LastName()
    lastName?: string;

    @UserEntityDoc.Country()
    country?: string;

    @UserEntityDoc.BillingAddress()
    billingAddress?: string;

    @UserEntityDoc.NewsletterSubscribed()
    newsletterSubscribed?: boolean;

    @UserEntityDoc.BirthdayDate()
    birthdayDate?: string;
}
