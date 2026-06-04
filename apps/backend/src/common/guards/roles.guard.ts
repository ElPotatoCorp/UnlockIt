import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { EmployeeRole } from "@unlockit/shared";
import { MinRole } from "src/user/decorators/support-roles.decorator";
import { ROLE_HIERARCHY } from "src/user/entities/employee.entity";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get(MinRole, context.getHandler())
      ?? this.reflector.get(MinRole, context.getClass()); // also works on controllers

    if (!requiredRole) return true; // no decorator = public endpoint

    const { user } = context.switchToHttp().getRequest();
    const permission: EmployeeRole = user?.employee?.role;

    if (!permission) return false;

    return ROLE_HIERARCHY[permission] >= ROLE_HIERARCHY[requiredRole];
  }
}