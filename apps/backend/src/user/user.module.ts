import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UploadModule } from 'src/upload/upload.module';
import { UserProfileEntity } from './entities/user-profile.entity';
import { UserBillingEntity } from './entities/user-billing.entity';
import { EmployeeEntity } from '../employees/entities/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      EmployeeEntity,
      UserProfileEntity,
      UserBillingEntity,
    ]),
    UploadModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
