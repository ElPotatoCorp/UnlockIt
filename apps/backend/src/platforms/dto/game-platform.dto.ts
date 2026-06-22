import { ExactData, GamePlatform } from '@unlockit/shared';
import { IsBoolean } from 'class-validator';
import { PlatformEntityDoc } from 'src/docs/platforms/entities/platform.entity.doc';

export class GamePlatformDto implements GamePlatform {
  @PlatformEntityDoc.Windows()
  @IsBoolean()
  windows: boolean;

  @PlatformEntityDoc.Mac()
  @IsBoolean()
  mac: boolean;

  @PlatformEntityDoc.Linux()
  @IsBoolean()
  linux: boolean;

  @PlatformEntityDoc.Ios()
  @IsBoolean()
  ios: boolean;

  @PlatformEntityDoc.Android()
  @IsBoolean()
  android: boolean;

  @PlatformEntityDoc.Switch()
  @IsBoolean()
  switch: boolean;

  @PlatformEntityDoc.Ps4()
  @IsBoolean()
  ps4: boolean;

  @PlatformEntityDoc.Ps5()
  @IsBoolean()
  ps5: boolean;

  @PlatformEntityDoc.XboxOne()
  @IsBoolean()
  xboxOne: boolean;

  @PlatformEntityDoc.XboxSeries()
  @IsBoolean()
  xboxSeries: boolean;
}

const _assertExact: ExactData<GamePlatform, GamePlatformDto> = true;
