import { Controller } from '@nestjs/common'
import ProductService from './product.service'

@Controller('product')
export default class ProductController {
  constructor(private readonly productService: ProductService) {}
}
