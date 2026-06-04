import { PublisherEntityDoc } from 'src/docs/publishers/entities/publisher.entity.doc';
import { Game } from 'src/games/entities/game.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('publishers')
export class Publisher {
  @PublisherEntityDoc.Id()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @PublisherEntityDoc.Name()
  @Column('varchar', { length: 200, unique: true })
  name: string;

  @PublisherEntityDoc.GamesCount()
  @Column('int', { name: 'games_count', default: 0 })
  gamesCount: number;

  @ManyToMany(() => Game, (game) => game.publishers, { lazy: true })
  games: Promise<Game[]>;
}