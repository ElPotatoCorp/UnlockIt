import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  create(createEmployeeDto: CreateEmployeeDto) {
    throw new NotImplementedException();
  }

  findAll() {
    throw new NotImplementedException();
  }

  findOne(id: number) {
    throw new NotImplementedException();
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    throw new NotImplementedException();
  }

  remove(id: number) {
    throw new NotImplementedException();
  }
}
