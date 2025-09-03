import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import ProductService from './product.service'
import RecommendProductsDto from './dto/recommend-products.dto'

@Controller('products')
export default class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  async getOne(@Param('id') id: number) {
    try {
      const result = await this.productService.getOne(id)
      return result
    } catch (error) {
      const { message } = error as Error
      if (message === 'PRODUCT_NOT_FOUND') {
        throw new NotFoundException()
      }
      throw new InternalServerErrorException()
    }
  }

  @Post('recommendations')
  async getRecommendations(@Body() dto: RecommendProductsDto) {
    try {
      const result = await this.productService.recommend(dto)
      return result
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
