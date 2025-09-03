import { Controller, Get, Query } from '@nestjs/common'
import CategoryService from './category.service'
import { GetCategoriesDto } from './dto'

@Controller('categories')
export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAll(@Query() query: GetCategoriesDto) {
    return this.categoryService.getAll(query)
  }
}
