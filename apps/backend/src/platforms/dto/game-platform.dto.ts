import { ExactData, GamePlatform } from '@unlockit/shared';
import { PlatformEntityDoc } from 'src/docs/platforms/entities/platform.entity.doc';

export class GamePlatformDto implements GamePlatform {
  @PlatformEntityDoc.Windows() windows: boolean;
  @PlatformEntityDoc.Mac() mac: boolean;
  @PlatformEntityDoc.Linux() linux: boolean;
  @PlatformEntityDoc.Ios() ios: boolean;
  @PlatformEntityDoc.Android() android: boolean;
  @PlatformEntityDoc.Switch() switch: boolean;
  @PlatformEntityDoc.Ps4() ps4: boolean;
  @PlatformEntityDoc.Ps5() ps5: boolean;
  @PlatformEntityDoc.XboxOne() xboxOne: boolean;
  @PlatformEntityDoc.XboxSeries() xboxSeries: boolean;
}

const _assertExact: ExactData<GamePlatform, GamePlatformDto> = true;
