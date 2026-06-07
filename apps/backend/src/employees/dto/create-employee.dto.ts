import { EmployeeRole } from '@unlockit/shared';
import { IsEnum, IsUUID } from 'class-validator';

export class CreateEmployeeDto {
  @IsUUID(4)
  id: string;

  @IsEnum(EmployeeRole)
  role: EmployeeRole;
}
