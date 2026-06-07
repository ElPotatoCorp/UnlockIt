import { EmployeeRole } from "@unlockit/shared";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

export const ROLE_HIERARCHY: Record<EmployeeRole, number> = {
  [EmployeeRole.SUPPORT]: 1,
  [EmployeeRole.MODERATOR]: 2,
  [EmployeeRole.ADMIN]: 3,
  [EmployeeRole.SUPER_ADMIN]: 4,
};

@Entity('employees')
export class EmployeeEntity {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user: User;

  @Column('enum', { enum: EmployeeRole, default: EmployeeRole.SUPPORT })
  role: EmployeeRole;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date;

  @Column('uuid', { name: 'created_by' })
  createdBy: string;
}