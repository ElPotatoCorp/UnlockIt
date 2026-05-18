import { registerDecorator, ValidationOptions } from "class-validator";

export function IsSlug(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => 
    registerDecorator({
      name: 'isSlug',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
        },
        defaultMessage() {
          return `${propertyName} must be a valid slug (lowercase letters, numbers, and hyphens only)`;
        }
      }
    })
}