import { ExactData, TicketEntity as ITicketEntity, TicketStatus } from '@unlockit/shared';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tickets')
@Check(`LENGTH(TRIM(reason)) > 0`)
@Check(`LENGTH(TRIM(content)) > 0`)
export class TicketEntity implements ITicketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  email: string;

  @Column('varchar', { length: 255 })
  reason: string;

  @Column('text')
  content: string;

  @Column('enum', { enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  // We allow guest in case someone cannot create an account or something
  @Column('uuid', { name: 'user_id', nullable: true })
  userId: string | null;

  @ManyToOne(() => UserEntity, (user) => user.tickets, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: Promise<UserEntity | null>;
}

const _assertExact: ExactData<ITicketEntity, TicketEntity> = true;
