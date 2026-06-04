import { User } from "src/user/entities/user.entity";
import { Check, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('tickets')
@Check(`LENGTH(TRIM(reason)) > 0`)
@Check(`LENGTH(TRIM(content)) > 0`)
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255, nullable: false })
  email: string;

  @Column('varchar', { length: 255, nullable: false })
  reason: string;

  @Column('text', { nullable: false })
  content: string;

  @Column('enum', { enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus;

  @Column('timestamptz', { name: 'created_at', default: () => 'NOW()' })
  created_at: Date;

  @Column('boolean', { name: 'is_customer', default: false })
  isCustomer: boolean;

  @Column('boolean', { name: 'is_employee', default: false })
  isEmployee: boolean;

  @Column('uuid', { name: 'user_id', default: () => 'gen_random_uuid()' })
  userId: string;

  @ManyToOne(() => User, user => user.tickets)
  user: User;
}
