import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { JWT_ACCESS_TOKEN_COOKIE_NAME } from './globals';
import { readFileSync } from 'fs';
import { join } from 'path';

export const httpsOptions =
  process.env.HTTPS === 'true'
    ? {
        key: readFileSync(
          join(process.env.SSL_DIR_PATH!, process.env.SSL_KEY_FILENAME!),
        ),
        cert: readFileSync(
          join(process.env.SSL_DIR_PATH!, process.env.SSL_CERT_FILENAME!),
        ),
      }
    : undefined;

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
      'Tags',
      'Endpoints related to tag management, including creation, retrieval, updating, and deletion of tags'
    )
    .addTag(
      'Developers',
      'Endpoints related to tag management, including creation, retrieval, updating, and deletion of developers'
    )
    .addTag(
      'Publishers',
      'Endpoints related to tag management, including creation, retrieval, updating, and deletion of publishers'
    )
    .addTag(
      'Series',
      'Endpoints related to series management, including creation, retrieval, updating, and deletion of series',
    )
    .addTag(
      'Reviews',
      'Single endpoints to vote for a review'
    )
    .addTag('Wishlist', 'Endpoints related to the authenticated user\'s wishlist')
    .addTag(
      'Cart',
      'Endpoints related to cart content management, including retrieval, addition, updating, and deletion of items'
    )
    .addTag(
      'Purchases',
      'Endpoints related to purchases, such as seeing all purchases, one, the keys, and also to manage reviews (creation, modification, deletion)'
    )
    .addTag(
      'Tickets',
      'Endpoints related to tickets management, including creation by anyone, retrieval by owner and employees, updating and deletionn by employees of tickets'
    )
    .addTag('Employees', 'Warning: Not implemented yet')
    .addTag(
      'Orders',
      'Endpoints related to orders. Since they are read-only, an authenticated user can only view all of them or one in details'
    )
    .addTag(
      'Wallet',
      'Endpoints related to wallet management, including addition of funds, retrieving the balance, or seeing all transactions'
    )
    .addTag(
      'Checkout',
      'Endpoints related to a checkout, for now including only the payment process using wallet only (we are still in dev)'
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
    origin:
      process.env.NODE_ENV === 'development' ? true : process.env.FRONTEND_URL,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  applyAppDocumentation(app);
}
