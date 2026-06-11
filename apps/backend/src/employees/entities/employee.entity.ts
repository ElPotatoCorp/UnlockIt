import {
  EmployeeEntity as IEmployeeEntity,
  EmployeeRole,
  ExactData,
} from '@unlockit/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('employees')
export class EmployeeEntity implements IEmployeeEntity {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, { lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user: Promise<UserEntity>;

  @Column('enum', { enum: EmployeeRole, default: EmployeeRole.SUPPORT })
  role: EmployeeRole;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt: Date;

  @Column('uuid', { name: 'created_by' })
  createdBy: string;
}

const _assertExact: ExactData<IEmployeeEntity, EmployeeEntity> = true;
