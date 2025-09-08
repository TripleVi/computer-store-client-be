import { Expose, Transform, Type } from 'class-transformer'
import { Option } from 'src/entities'

class ProductDto {
  @Expose() id: number
  @Expose() name: string
}

class OptionDto {
  @Expose() name: string

  @Transform(params => (params.obj as Option).file.name, {
    toClassOnly: true,
  })
  @Expose()
  image: string
}

export default class VariantCardDto {
  @Expose() id: number
  @Expose() price: number

  @Type(() => ProductDto)
  @Expose()
  product: ProductDto

  @Type(() => OptionDto)
  @Expose()
  options: OptionDto
}
