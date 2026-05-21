import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsUsername(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) =>
    registerDecorator({
      name: 'isUsername',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && /^[a-zA-Z0-9_-]+$/.test(value);
        },
        defaultMessage() {
          return `${propertyName} must be a valid username (letters, numbers, underscores, and hyphens only)`;
        },
      },
    });
}
