import { UserEntity } from "../user/user.types";
import { EmployeeRole } from "./employee.enums";

export type EmployeeEntity = {
  id: string;
  user: UserEntity;
  role: EmployeeRole;
  createdAt: Date;
  createdBy: string;
}

export type Employee = Omit<EmployeeEntity, 'user'>;

export type CreateEmployee = Pick<EmployeeEntity, 'id' | 'role'>;

export type UpdateEmployee = Partial<Omit<CreateEmployee, 'id'>>;