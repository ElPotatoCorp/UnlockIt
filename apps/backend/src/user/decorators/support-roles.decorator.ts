import { Reflector } from "@nestjs/core";
import { EmployeeRole } from "@unlockit/shared";

export const MinRole = Reflector.createDecorator<EmployeeRole>();