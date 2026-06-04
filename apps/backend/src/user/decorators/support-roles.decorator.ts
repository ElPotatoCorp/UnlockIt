import { Reflector } from "@nestjs/core";
import { EmployeeRole } from "../entities/employee.entity";

export const MinRole = Reflector.createDecorator<EmployeeRole>();