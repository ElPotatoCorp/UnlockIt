import { ExactData, SessionEntity as ISessionEntity } from '@unlockit/shared';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sessions')
@Check(`LENGTH(refresh_token_hash) = 64`)
@Index('idx_sessions_user_id', ['user'])
@Index('idx_sessions_expires_at', ['expiresAt'])
export class SessionEntity implements ISessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column('char', { name: 'refresh_token_hash', length: 64 })
  refreshTokenHash: string;

  @Column('inet', { name: 'ip_address' })
  ipAddress: string;

  @Column('varchar', { name: 'user_agent', length: 512 })
  userAgent: string;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'NOW()',
  })
  createdAt: Date;

  @Column('timestamptz', {
    name: 'expires_at',
    default: () => "NOW() + INTERVAL '30 days'",
  })
  expiresAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'last_seen_at',
    default: () => 'NOW()',
  })
  lastSeenAt: Date;

  @Column('boolean', { name: 'flagged', default: false })
  flagged: boolean;

  // -------------------------------------------------------
  // Relations - not loaded unless explicitly requested
  // -------------------------------------------------------

  @ManyToOne(() => UserEntity, (user) => user.sessions, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}

const _assertExact: ExactData<ISessionEntity, SessionEntity> = true;
