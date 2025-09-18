import { Module } from '@nestjs/common'
import AppController from './app.controller'
import AppService from './app.service'
import AppConfigModule from './config/app-config.module'
import DatabaseModule from './database/database.module'
import { CategoryModule, ProductModule, VariantModule } from './modules'

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    CategoryModule,
    ProductModule,
    VariantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
