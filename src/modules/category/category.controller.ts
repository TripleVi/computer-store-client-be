import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import CategoryService from './category.service'
import { GetCategoriesDto } from './dto'
import GetRecsDto from './dto/get-recs.dto'

@Controller('categories')
export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll(@Query() query: GetCategoriesDto) {
    try {
      return await this.categoryService.getAll(query)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    try {
      return await this.categoryService.getOne(id)
    } catch (error) {
      const { message } = error as Error
      if (message === 'CATEGORY_NOT_FOUND') {
        throw new NotFoundException()
      }
      console.log(error)
      throw new InternalServerErrorException()
    }
  }

  @Post('recommendations')
  async getRecommendations(@Body() body: GetRecsDto) {
    try {
      return await this.categoryService.recommend(body)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }
}
