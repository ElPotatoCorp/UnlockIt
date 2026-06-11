import { EmployeeRole } from "../employee/employee.enums";

export type JwtPayload = {
  /** Subject (user id) */
  sub: string;

  /** Session id */
  sid: string;

  /** Issued at */
  iat: number;

  /** Expiration time */
  exp: number;
  permission: EmployeeRole | null;
};

export type CreatePasswordReset = {
  identifier: string;
}

export type ResetPasswordDto = {
  password: string;
}