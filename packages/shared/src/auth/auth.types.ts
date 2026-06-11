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

  cartId: string;
  permission: EmployeeRole | null;
};

export type CreateJwtPayload = Omit<JwtPayload, 'sid' | 'iat' | 'exp'>;

export type CreatePasswordReset = {
  identifier: string;
}

export type ResetPassword = {
  password: string;
}