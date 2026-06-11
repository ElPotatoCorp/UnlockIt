import { ExactData, MediaEntity as IMediaEntity, MediaType } from '@unlockit/shared';
import { MediaEntityDoc } from 'src/docs/media/entities/media.entity.doc';
import { GameEntity } from 'src/games/entities/game.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('media')
export class MediaEntity implements IMediaEntity {
  @MediaEntityDoc.Id()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @MediaEntityDoc.GameId()
  @Column('bigint', { name: 'game_id' })
  gameId: number;

  @ManyToOne(() => GameEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: GameEntity;

  @MediaEntityDoc.Url()
  @Column('varchar', { length: 255 })
  url: string;

  @MediaEntityDoc.Type()
  @Column({ type: 'enum', enum: MediaType, default: MediaType.IMAGE })
  type: MediaType;
}

const _assertExact: ExactData<IMediaEntity, MediaEntity> = true;