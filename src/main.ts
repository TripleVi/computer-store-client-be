import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import AppModule from './app.module'
import { LoggerMiddleware } from './common/middlewares'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.enableCors({
    origin: [configService.get<string>('ORIGIN', '')],
    optionsSuccessStatus: 200,
    credentials: true,
  })
  app.setGlobalPrefix('api/v1')
  app.use(new LoggerMiddleware().use)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors: ValidationError[]) => {
        return new BadRequestException(
          validationErrors.map(error => ({
            field: error.property,
            error: Object.values(error.constraints!)[0],
          }))
        )
      },
    })
  )

  const PORT = configService.get<number>('PORT', 3000)
  await app.listen(PORT)
  console.log('Server is running on port', PORT)
}
bootstrap()
