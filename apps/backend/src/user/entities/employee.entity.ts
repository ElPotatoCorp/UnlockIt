import { EmployeeRole } from "@unlockit/shared";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

export const ROLE_HIERARCHY: Record<EmployeeRole, number> = {
  [EmployeeRole.SUPPORT]: 1,
  [EmployeeRole.MODERATOR]: 2,
  [EmployeeRole.ADMIN]: 3,
  [EmployeeRole.SUPER_ADMIN]: 4,
};

@Entity('employees')
export class Employee {
  @PrimaryColumn('uuid')
  id: string;

  @Column('enum', { enum: EmployeeRole, default: EmployeeRole.SUPPORT })
  role: EmployeeRole;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date;

  @Column('uuid', { name: 'created_by' })
  createdBy: string;
}