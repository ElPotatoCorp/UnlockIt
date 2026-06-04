import { PlatformEntityDoc } from 'src/docs/platforms/entities/platform.entity.doc';
import { Game } from 'src/games/entities/game.entity';
import { OneToOne, JoinColumn, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('game_platforms')
export class GamePlatform {
  @PrimaryColumn('bigint', { name: 'game_id' })
  gameId: number;

  @OneToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @PlatformEntityDoc.Windows()
  @Column('boolean', { default: false })
  windows: boolean;

  @PlatformEntityDoc.Mac()
  @Column('boolean', { default: false })
  mac: boolean;

  @PlatformEntityDoc.Linux()
  @Column('boolean', { default: false })
  linux: boolean;

  @PlatformEntityDoc.Ios()
  @Column('boolean', { default: false })
  ios: boolean;

  @PlatformEntityDoc.Android()
  @Column('boolean', { default: false })
  android: boolean;

  @PlatformEntityDoc.Switch()
  @Column('boolean', { default: false })
  switch: boolean;

  @PlatformEntityDoc.Ps4()
  @Column('boolean', { default: false })
  ps4: boolean;

  @PlatformEntityDoc.Ps5()
  @Column('boolean', { default: false })
  ps5: boolean;

  @PlatformEntityDoc.XboxOne()
  @Column('boolean', { name: 'xbox_one', default: false })
  xboxOne: boolean;

  @PlatformEntityDoc.XboxSeries()
  @Column('boolean', { name: 'xbox_series', default: false })
  xboxSeries: boolean;
}
