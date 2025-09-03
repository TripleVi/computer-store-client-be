import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category, Product } from 'src/entities'
import CategoryController from './category.controller'
import CategoryService from './category.service'

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export default class CategoryModule {}
