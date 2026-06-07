import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamePlatformEntity } from './entities/game-platform.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GamePlatformEntity])],
  exports: [TypeOrmModule]
})
export class PlatformsModule {}
