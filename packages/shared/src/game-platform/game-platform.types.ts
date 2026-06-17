import { GameEntity } from "../game/game.types";

export type GamePlatformEntity = {
  gameId: number;
  game: GameEntity;
  windows: boolean;
  mac: boolean;
  linux: boolean;
  ios: boolean;
  android: boolean;
  switch: boolean;
  ps4: boolean;
  ps5: boolean;
  xboxOne: boolean;
  xboxSeries: boolean;
};

export type GamePlatform = Omit<GamePlatformEntity, 'gameId' | 'game'>;

export type PartialGamePlatform = Partial<GamePlatform>;

export type UpdatePlatform = Partial<GamePlatform>;
