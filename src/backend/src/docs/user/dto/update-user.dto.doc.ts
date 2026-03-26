import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export const UpdateUserDtoDoc = {
  Username: () => applyDecorators(
    ApiProperty({
      title: 'Username',
      description: 'The username of the user. Must be alphanumeric and at least 3 characters.',
      type: String,
      minLength: 3,
      maxLength: 50,
      pattern: '^[a-zA-Z0-9]+$',
      example: 'johndoe_updated',
      required: false,
      nullable: false,
    })
  ),

  Password: () => applyDecorators(
    ApiProperty({
      title: 'Password',
      description: 'The new password for the account. Never returned in responses. Encrypted and stored securely.',
      type: String,
      format: 'password',
      minLength: 8,
      maxLength: 64,
      example: 'NewStr0ng!Pass',
      required: false,
      writeOnly: true,
    })
  ),

  Email: () => applyDecorators(
    ApiProperty({
      title: 'Email address',
      description: 'The email address of the user. Must be unique.',
      type: String,
      format: 'email',
      example: 'john.updated@example.com',
      required: false,
      nullable: false,
      uniqueItems: true,
    })
  ),

  PhoneWzc: () => applyDecorators(
    ApiProperty({
      title: 'Phone country code',
      description: 'The country code for the phone number (1-3 digits). Example: 33 for France, 1 for USA.',
      type: String,
      pattern: '^\\d{1,3}$',
      example: '33',
      required: false,
      nullable: true,
    })
  ),

  PhoneNumber: () => applyDecorators(
    ApiProperty({
      title: 'Phone number',
      description: 'The phone number without country code (7-15 digits). Must be provided with phoneWzc.',
      type: String,
      pattern: '^\\d{7,15}$',
      example: '612345678',
      required: false,
      nullable: true,
    })
  ),

  Bio: () => applyDecorators(
    ApiProperty({
      title: 'Bio',
      description: 'A short biography or personal description.',
      type: String,
      example: 'I love gaming and collecting rare titles!',
      required: false,
      nullable: true,
    })
  ),

  FirstName: () => applyDecorators(
    ApiProperty({
      title: 'First name',
      description: 'The first name of the user.',
      type: String,
      maxLength: 100,
      example: 'John',
      required: false,
      nullable: true,
    })
  ),

  LastName: () => applyDecorators(
    ApiProperty({
      title: 'Last name',
      description: 'The last name of the user.',
      type: String,
      maxLength: 100,
      example: 'Doe',
      required: false,
      nullable: true,
    })
  ),

  Country: () => applyDecorators(
    ApiProperty({
      title: 'Country',
      description: 'The country where the user is located.',
      type: String,
      maxLength: 100,
      example: 'France',
      required: false,
      nullable: true,
    })
  ),

  BillingAddress: () => applyDecorators(
    ApiProperty({
      title: 'Billing address',
      description: 'The full billing address for purchases and transactions.',
      type: String,
      example: '123 Main Street, Paris, 75001, France',
      required: false,
      nullable: true,
    })
  ),

  NewsletterSubscribed: () => applyDecorators(
    ApiProperty({
      title: 'Newsletter subscription',
      description: 'Whether the user is subscribed to the newsletter.',
      type: Boolean,
      example: true,
      required: false,
      default: false,
    })
  ),

  BirthdayDate: () => applyDecorators(
    ApiProperty({
      title: 'Birthday',
      description: "The user's date of birth in YYYY-MM-DD format. Must be in the past.",
      type: String,
      format: 'date',
      example: '1990-05-15',
      required: false,
      nullable: true,
    })
  ),
}
