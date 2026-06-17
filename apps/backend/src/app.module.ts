import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { ENV_FILES_PATHS, UPLOADS_DIR } from './globals';
import coreConfig from './config/core.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import throttlerConfig from './config/throttler.config';

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
import { SeriesModule } from './series/series.module';
import { GamesModule } from './games/games.module';
import { CommonModule } from './common/common.module';
import { DevelopersModule } from './developers/developers.module';
import { PublishersModule } from './publishers/publishers.module';
import { PlatformsModule } from './platforms/platforms.module';
import { MediaModule } from './media/media.module';
import { TicketsModule } from './tickets/tickets.module';
import { RolesGuard } from './employees/guards/roles.guard';
import { EmployeesModule } from './employees/employees.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { StocksModule } from './stocks/stocks.module';
import { OrdersModule } from './orders/orders.module';
import { WalletModule } from './wallet/wallet.module';
import { CheckoutModule } from './checkout/checkout.module';
import { PurchasesModule } from './purchases/purchases.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ENV_FILES_PATHS,
      isGlobal: true,
      load: [coreConfig, databaseConfig, jwtConfig, throttlerConfig],
    }),
    ThrottlerModule.forRootAsync({
      inject: [throttlerConfig.KEY],
      useFactory: (config: ConfigType<typeof throttlerConfig>) => ({
        throttlers: [
          {
            name: 'authRegister',
            ttl: config.authRegister.ttl,
            limit: config.authRegister.limit,
          },
          {
            name: 'authLogin',
            ttl: config.authLogin.ttl,
            limit: config.authLogin.limit,
          },
          {
            name: 'authResetPassword',
            ttl: config.authResetPassword.ttl,
            limit: config.authResetPassword.limit,
          },
        ],
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: UPLOADS_DIR,
      serveRoot: '/uploads',
      useGlobalPrefix: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [coreConfig.KEY, databaseConfig.KEY],
      useFactory: (
        config: ConfigType<typeof coreConfig>,
        dbConfig: ConfigType<typeof databaseConfig>,
      ) => ({
        type: 'postgres',
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        autoLoadEntities: true,
        parseInt8: true,

        migrations: ['dist/database/migrations/**/*.{ts,js}'],
        migrationsRun: config.env === 'production' ? true : false,
        synchronize: config.env === 'production' ? false : true,
      }),
    }),
    UsersModule,
    AuthModule,
    UploadModule,
    UserModule,
    SessionsModule,
    SeriesModule,
    GamesModule,
    CommonModule,
    DevelopersModule,
    PublishersModule,
    PlatformsModule,
    MediaModule,
    TicketsModule,
    EmployeesModule,
    WishlistModule,
    StocksModule,
    OrdersModule,
    WalletModule,
    CheckoutModule,
    PurchasesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
  ],
})
export class AppModule {}
