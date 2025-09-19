import { Module } from '@nestjs/common'
import AppController from './app.controller'
import AppService from './app.service'
import AppConfigModule from './config/app-config.module'
import DatabaseModule from './database/database.module'
import { CategoryModule, ProductModule, VariantModule } from './modules'
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    CategoryModule,
    ProductModule,
    VariantModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
