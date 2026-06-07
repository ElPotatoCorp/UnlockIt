import { UserEntity } from "../user/user.types";
import { EmployeeRole } from "./employee.enums";

export type EmployeeEntity = {
  id: string;
  user: Promise<UserEntity>;
  role: EmployeeRole;
  createdAt: Date;
  createdBy: string;
}

export type Employee = Omit<EmployeeEntity, 'user'>;