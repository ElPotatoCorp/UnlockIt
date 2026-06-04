import { TagEntityDoc } from 'src/docs/tags/entities/tag.entity.doc';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from 'src/games/entities/game.entity';
import { TagEntity } from '@unlockit/shared';

@Entity('tags')
export class Tag implements TagEntity {
  @TagEntityDoc.Id()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @TagEntityDoc.Name()
  @Column('varchar', { length: 150, unique: true })
  name: string;

  @TagEntityDoc.GamesCount()
  @Column('int', { name: 'games_count', default: 0 })
  gamesCount: number;

  @ManyToMany(() => Game, (game) => game.tags, { lazy: true })
  games: Promise<Game[]>;
}