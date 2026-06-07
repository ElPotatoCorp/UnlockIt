import { EmployeeRole } from "./employee.enums";

export const ROLE_HIERARCHY: Record<EmployeeRole, number> = {
  [EmployeeRole.SUPPORT]: 1,
  [EmployeeRole.MODERATOR]: 2,
  [EmployeeRole.ADMIN]: 3,
  [EmployeeRole.SUPER_ADMIN]: 4,
  [EmployeeRole.OWNER]: 5,
};