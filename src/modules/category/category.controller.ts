import { Controller, Get } from '@nestjs/common'
import CategoryService from './category.service'

@Controller('categories')
export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  fetchAll() {
    return this.categoryService.findAll()
  }
}
