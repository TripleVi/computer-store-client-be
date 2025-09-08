import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import Joi from 'joi'
import path from 'path'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { VariantModule } from './modules/variant/variant.module';
import AppController from './app.controller'
import AppService from './app.service'
import CategoryModule from './modules/category/category.module'
import ProductModule from './modules/product/product.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // injected into all modules
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        ORIGIN: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        username: configService.getOrThrow('DB_USERNAME'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        entities: [path.join(__dirname, 'entities', '*.entity.{ts,js}')],
        synchronize: false,
        logging: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    CategoryModule,
    ProductModule,
    VariantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
