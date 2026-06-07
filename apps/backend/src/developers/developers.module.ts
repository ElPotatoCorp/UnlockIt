import { Module } from '@nestjs/common';
import { DeveloperEntity } from './entities/developer.entity';
import { DevelopersController } from './developers.controller';
import { DevelopersService } from './developers.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DeveloperEntity])],
  controllers: [DevelopersController],
  providers: [DevelopersService],
  exports: [TypeOrmModule],
})
export class DevelopersModule {}