import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { JWT_ACCESS_TOKEN_COOKIE_NAME } from './globals';

function applyAppDocumentation(app: INestApplication<any>): void {
  const config = new DocumentBuilder()
    .setTitle('UnlockIt API')
    .setDescription(
      'This API documentation provides an overview of the available endpoints and their functionalities for the UnlockIt application. It includes details about authentication, user management, and other general application-related endpoints.',
    )
    .addTag('App', 'General endpoints related to the application')
    .addTag('Auth', 'Endpoints related to authentication and user sessions')
    .addTag(
      'User',
      'Related to user management and information about the currently authenticated user',
    )
    .addTag('Users', 'Related to everything a user made publicly')
    .addTag(
      'Games',
      'Endpoints related to game management, including creation, retrieval, updating, and deletion of games',
    )
    .addTag(
      'Series',
      'Endpoints related to series management, including creation, retrieval, updating, and deletion of series',
    )
    .addGlobalResponse({
      status: 500,
      description:
        'Internal server error. It could be an unexpected error or simply a unhandled specific case.',
    })
    .addCookieAuth(JWT_ACCESS_TOKEN_COOKIE_NAME)
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, documentFactory);
}

export default function applyAppParams(app: INestApplication<any>): void {
  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown fields
      forbidNonWhitelisted: true, // throws if unknown fields sent
      transform: true, // auto-transforms payloads to DTO class instances
    }),
  );

  app.enableCors({
    origin: process.env.NODE_ENV === 'development' ? true : process.env.FRONTEND_URL,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  applyAppDocumentation(app);
}
