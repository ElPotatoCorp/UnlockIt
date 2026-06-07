import { GameEntity } from "../game/game.types";
import { MediaType } from "./media.enums";

export type MediaEntity = {
  id: number;
  gameId: number;
  game: GameEntity;
  url: string;
  /** @default MediaType.IMAGE */
  type: MediaType;
};

export type Media = Pick<MediaEntity, 'id' | 'url' | 'type'>

export type CreateMedia = Omit<Media, 'id' >;