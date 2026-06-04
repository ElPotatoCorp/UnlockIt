import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamePlatform } from './entities/game-platform.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GamePlatform])],
  exports: [TypeOrmModule]
})
export class PlatformsModule {}
