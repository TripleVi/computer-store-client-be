import { Expose, Transform, Type } from 'class-transformer'
import { Option, Product } from 'src/entities'

class CategoryDto {
  @Expose() id: number
  @Expose() name: string
}

class OptionDto {
  @Expose() id: number
  @Expose() name: string

  @Expose()
  @Transform(params => (params.obj as Option).file.name, {
    toClassOnly: true,
  })
  image: string
}

class TypeDto {
  @Expose() id: number
  @Expose() name: string

  @Type(() => OptionDto)
  @Expose()
  options: OptionDto[]
}

class VariantDto {
  @Expose() sold: number
  @Expose() quantity: number
  @Expose() price: number
}

export class ProductDto {
  @Expose() id: number
  @Expose() name: string
  @Expose() description: string

  @Type(() => CategoryDto)
  @Expose()
  category: CategoryDto

  @Type(() => TypeDto)
  @Expose()
  types: TypeDto[]

  @Type(() => VariantDto)
  @Expose()
  variants: VariantDto[]

  @Expose()
  @Transform(params => (params.obj as Product).productFiles.map(e => e.file.name), {
    toClassOnly: true,
  })
  images: string[]
}
