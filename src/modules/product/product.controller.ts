import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'

import { JwtAuthGuard } from 'src/common/guards'
import RecommendProductsDto from './dto/recommend-products.dto'
import SearchProductsDto from './dto/search-products.dto'
import ProductService from './product.service'

@Controller('products')
export default class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Get('query')
  async search(@Query() query: SearchProductsDto) {
    try {
      return await this.productService.search(query)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    try {
      return await this.productService.getOne(id)
    } catch (error) {
      const { message } = error as Error
      if (message === 'PRODUCT_NOT_FOUND') {
        throw new NotFoundException()
      }
      console.log(error)
      throw new InternalServerErrorException()
    }
  }

  @Post('recommendations')
  async getRecommendations(@Body() dto: RecommendProductsDto) {
    try {
      return await this.productService.recommend(dto)
    } catch (error) {
      // const { message } = error as Error
      // if (message === 'PRODUCT_NOT_FOUND') {
      //   throw new NotFoundException()
      // }
      console.log(error)
      throw new InternalServerErrorException()
    }
  }
}
