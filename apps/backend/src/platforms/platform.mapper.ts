import { GamePlatformDto } from "./dto/game-platform.dto";
import { GamePlatformEntity } from "./entities/game-platform.entity";

export class PlatformMapper {
  static toGamePlatform(gamePlatform: GamePlatformEntity) {
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