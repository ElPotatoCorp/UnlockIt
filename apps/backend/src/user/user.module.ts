import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UploadModule } from 'src/upload/upload.module';
import { UserProfile } from './entities/user-profile.entity';
import { UserBilling } from './entities/user-billing.entity';
import { EmployeeEntity } from './entities/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmployeeEntity, UserProfile, UserBilling]),
    UploadModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
