import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { ENV_FILE_PATH, UPLOADS_DIR } from './globals';
import jwtConfig from './config/jwt.config';
import databaseConfig from './config/database.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, type ConfigType } from '@nestjs/config';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ServeStaticModule } from '@nestjs/serve-static';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { SessionsModule } from './sessions/sessions.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'authRegister', ttl: 1000 * 60 * 60, limit: 3 },
        { name: 'authLogin', ttl: 1000 * 15, limit: 5 },
      ]
    }),
    ConfigModule.forRoot({
      envFilePath: ENV_FILE_PATH,
      isGlobal: true,
      load: [jwtConfig, databaseConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: UPLOADS_DIR,
      serveRoot: '/uploads',
      useGlobalPrefix: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (config: ConfigType<typeof databaseConfig>) => ({
        type: 'postgres',
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        autoLoadEntities: true,

        migrations:  ["dist/database/migrations/**/*.{ts,js}"],
        migrationsRun: true,
        synchronize: false,
      }),
    }),
    UsersModule,
    AuthModule,
    UploadModule,
    UserModule,
    SessionsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService
  ],
})
export class AppModule { }