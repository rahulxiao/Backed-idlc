import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotFutureDate', async: false })
export class IsNotFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (!value) return true; // null/undefined handled by @IsOptional or @IsNotEmpty
    const date = new Date(value);
    if (isNaN(date.getTime())) return false;
    return date <= new Date();
  }

  defaultMessage(): string {
    return 'Date of birth cannot be a future date';
  }
}

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotFutureDateConstraint,
    });
  };
}
