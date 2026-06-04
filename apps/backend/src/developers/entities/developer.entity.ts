import { DeveloperEntity } from '@unlockit/shared';
import { DeveloperEntityDoc } from 'src/docs/developers/entities/developer.entity.doc';
import { Game } from 'src/games/entities/game.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('developers')
export class Developer implements DeveloperEntity {
  @DeveloperEntityDoc.Id()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @DeveloperEntityDoc.Name()
  @Column('varchar', { length: 200, unique: true })
  name: string;

  @DeveloperEntityDoc.GamesCount()
  @Column('int', { name: 'games_count', default: 0 })
  gamesCount: number;

  @ManyToMany(() => Game, (game) => game.developers, { lazy: true })
  games: Promise<Game[]>;
}