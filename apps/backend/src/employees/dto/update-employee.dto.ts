import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-employee.dto';
import { ExactData, UpdateEmployee } from '@unlockit/shared';

export class UpdateEmployeeDto
  extends PartialType(OmitType(CreateEmployeeDto, ['id']))
  implements UpdateEmployee {}

const _assertExact: ExactData<UpdateEmployee, UpdateEmployeeDto> = true;
