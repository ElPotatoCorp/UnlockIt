import {
  ExactData,
  GamePlatformEntity as IGamePlatformEntity,
} from '@unlockit/shared';
import { PlatformEntityDoc } from 'src/docs/platforms/entities/platform.entity.doc';
import { GameEntity } from 'src/games/entities/game.entity';
import { OneToOne, JoinColumn, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('game_platforms')
export class GamePlatformEntity implements IGamePlatformEntity {
  @PrimaryColumn('int', { name: 'game_id' })
  gameId: number;

  @OneToOne(() => GameEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: GameEntity;

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

const _assertExact: ExactData<IGamePlatformEntity, GamePlatformEntity> = true;
