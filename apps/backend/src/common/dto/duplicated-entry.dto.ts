import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

export const DuplicatedEntryExceptionSchemaDoc = (
  itemType: any,
  allowedFields: string[],
) => ({
  allOf: [
    { $ref: getSchemaPath(DuplicatedEntryException) },
    {
      properties: {
        invalidFields: {
          type: 'array',
          items: {
            type: 'string',
            enum: allowedFields,
          },
        },
        messages: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'A map of invalid fields and their reason messages',
        },
      },
    },
  ],
});

export class DuplicatedEntryException<T> extends HttpException {
  @ApiProperty({
    description: "List of fields that violated the unique constraint.",
    example: ['email', 'username'],
  })
  invalidFields: (keyof T)[];

  @ApiProperty({
    description: 'Human-readable error messages mapped to each invalid field.',
    example: { email: 'Email already exists', username: 'Username is taken' },
  })
  messages: Partial<Record<keyof T, string>>;

  constructor(
    invalidFields: (keyof T)[], 
    messages: Partial<Record<keyof T, string>>
  ) {
    const responseBody = {
      statusCode: HttpStatus.CONFLICT,
      message: 'There are conflicts with some fields',
      error: 'Conflict',
      invalidFields,
      messages,
    };

    super(responseBody, HttpStatus.CONFLICT);

    this.invalidFields = invalidFields;
    this.messages = messages;
  }
}
