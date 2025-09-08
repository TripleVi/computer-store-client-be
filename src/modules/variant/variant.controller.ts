import { Controller, Get, InternalServerErrorException, Query } from '@nestjs/common'
import GetVariantsDto from './dto/get-variants.dto'
import { VariantService } from './variant.service'

@Controller('variants')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Get()
  async getAll(@Query() dto: GetVariantsDto) {
    try {
      return await this.variantService.getAll(dto)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }
}
