import { GamePlatform } from "@unlockit/shared";
import { PlatformEntityDoc } from "src/docs/platforms/entities/platform.entity.doc";

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

  static fromEntity(gamePlatform: GamePlatform): GamePlatformDto {
    const dto = new GamePlatformDto();

    dto.windows = gamePlatform.windows;
    dto.mac = gamePlatform.mac;
    dto.linux = gamePlatform.linux;
    dto.ios = gamePlatform.ios;
    dto.android = gamePlatform.android;
    dto.switch = gamePlatform.switch;
    dto.ps4 = gamePlatform.ps4;
    dto.ps5 = gamePlatform.ps5;
    dto.xboxOne = gamePlatform.xboxOne;
    dto.xboxSeries = gamePlatform.xboxSeries;

    return dto;
  }
}