import { MediaEntityDoc } from 'src/docs/media/entities/media.entity.doc';
import { Game } from 'src/games/entities/game.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum MediaType {
  VIDEO = 'video',
  IMAGE = 'image',
}

@Entity('media')
export class Media {
  @MediaEntityDoc.Id()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @MediaEntityDoc.GameId()
  @Column('bigint', { name: 'game_id' })
  gameId: number;

  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @MediaEntityDoc.Url()
  @Column('varchar', { length: 255 })
  url: string;

  @MediaEntityDoc.Type()
  @Column({ type: 'enum', enum: MediaType, nullable: true })
  type: MediaType | null;
}