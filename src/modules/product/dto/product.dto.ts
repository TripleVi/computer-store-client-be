import { Expose, Transform, Type } from 'class-transformer'
import { Option, Product, Variant } from 'src/entities'

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

  @Expose()
  @Type(() => OptionDto)
  options: OptionDto[]
}

class VariantDto {
  @Expose() id: number
  @Expose() sold: number
  @Expose() quantity: number
  @Expose() price: number

  @Expose()
  // params.value return undefined ???
  @Transform(params => (params.obj as Variant).options.map(o => o.id), {
    toClassOnly: true,
  })
  options: number[]
}

export class ProductDto {
  @Expose() id: number
  @Expose() name: string
  @Expose() description: string

  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto

  @Expose()
  @Type(() => TypeDto)
  types: TypeDto[]

  @Expose()
  @Type(() => VariantDto)
  variants: VariantDto[]

  @Expose()
  @Transform(params => (params.obj as Product).productFiles.map(e => e.file.name), {
    toClassOnly: true,
  })
  images: string[]
}
