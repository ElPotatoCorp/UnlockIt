import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";

function applyAppDocumentation(app: INestApplication<any>): void {
  const config = new DocumentBuilder()
    .setTitle('UnlockIt API')
    .setDescription('This API documentation provides an overview of the available endpoints and their functionalities for the UnlockIt application. It includes details about authentication, user management, and other general application-related endpoints.')
    .addTag('App', 'General endpoints related to the application')
    .addTag('Auth', 'Endpoints related to authentication and user sessions')
    .addTag('User', 'Related to user management and information about the currently authenticated user')
    .addTag('Users', 'Related to everything a user made publicly')
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error. It could be an unexpected error or simply a unhandled specific case.',
    })
    .addCookieAuth('jwt')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
}

export default function applyAppParams(app: INestApplication<any>): void {
  app.setGlobalPrefix('api');

  app.use(cookieParser());

  applyAppDocumentation(app);
}