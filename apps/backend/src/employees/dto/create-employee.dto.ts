import { CreateEmployee, EmployeeRole, ExactData } from '@unlockit/shared';
import { IsEnum, IsUUID } from 'class-validator';

export class CreateEmployeeDto implements CreateEmployee {
  @IsUUID(4)
  id: string;

  @IsEnum(EmployeeRole)
  role: EmployeeRole;
}

const _assertExact: ExactData<CreateEmployee, CreateEmployeeDto> = true;