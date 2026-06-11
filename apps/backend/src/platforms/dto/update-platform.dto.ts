import { ExactData, UpdatePlatform } from '@unlockit/shared';
import { IsBoolean, IsOptional } from 'class-validator';
import { PlatformEntityDoc } from 'src/docs/platforms/entities/platform.entity.doc';

export class UpdatePlatformDto implements UpdatePlatform {
  @PlatformEntityDoc.Windows() @IsOptional() @IsBoolean() windows?: boolean;
  @PlatformEntityDoc.Mac() @IsOptional() @IsBoolean() mac?: boolean;
  @PlatformEntityDoc.Linux() @IsOptional() @IsBoolean() linux?: boolean;
  @PlatformEntityDoc.Ios() @IsOptional() @IsBoolean() ios?: boolean;
  @PlatformEntityDoc.Android() @IsOptional() @IsBoolean() android?: boolean;
  @PlatformEntityDoc.Switch() @IsOptional() @IsBoolean() switch?: boolean;
  @PlatformEntityDoc.Ps4() @IsOptional() @IsBoolean() ps4?: boolean;
  @PlatformEntityDoc.Ps5() @IsOptional() @IsBoolean() ps5?: boolean;
  @PlatformEntityDoc.XboxOne() @IsOptional() @IsBoolean() xboxOne?: boolean;
  @PlatformEntityDoc.XboxSeries() @IsOptional() @IsBoolean() xboxSeries?: boolean;
}

const _assertExact: ExactData<UpdatePlatform, UpdatePlatformDto> = true;