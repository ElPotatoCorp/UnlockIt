import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export const CreateUserDtoDoc = {
  Username: () => applyDecorators(
    ApiProperty({
      // Basic info
      title: 'Username',
      description: 'The unique username of the user. Must be alphanumeric.',

      // Type hints (useful for complex types, normally inferred automatically)
      type: String,
      format: 'string', // OpenAPI formats: 'email', 'uuid', 'date', 'date-time', 'password', 'binary', 'byte', 'uri'

      // Validation hints (purely visual in Swagger, does NOT enforce validation — use class-validator for that)
      minLength: 3,
      maxLength: 20,
      pattern: '^[a-zA-Z0-9]+$',

      // Example values
      example: 'johndoe',          // single example
      examples: {                   // multiple examples (overrides example if both set)
        simple: {
          summary: 'Simple username',
          value: 'johndoe',
        },
        withNumbers: {
          summary: 'Username with numbers',
          value: 'johndoe42',
        },
      },

      // Availability
      required: true,               // marks field as required in Swagger UI (default: true)
      nullable: false,              // whether the field can be null
      uniqueItems: true,            // hints this should be unique (informational only)
      
      // Read/write control
      readOnly: false,              // if true, only shown in responses, not in request body
      writeOnly: false,             // if true, only shown in request body, not in responses (useful for passwords)
      deprecated: false,            // marks the field as deprecated in Swagger UI

      // Default value (shown in Swagger UI as prefilled)
      default: undefined,
    })
  ),

  Password: () => applyDecorators(
    ApiProperty({
      title: 'Password',
      description: 'The account password. Never returned in responses. Encrypted and stored securely on the server.',
      type: String,
      format: 'password',
      example: 'Str0ng!Pass',
      minLength: 8,
      maxLength: 64,
      writeOnly: true,
      required: true,
    })
  ),

  Email: () => applyDecorators(
    ApiProperty({
      title: 'Email address',
      description: 'The email address of the user. Must be unique.',
      type: String,
      format: 'email',
      example: 'john@example.com',
      required: true,
      nullable: false,
      uniqueItems: true,            // hints this should be unique (informational only)
    })
  )
}