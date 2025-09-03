import { Expose, Transform } from 'class-transformer'
import { Product } from 'src/entities'

export class ProductCardDto {
  @Expose() id: number
  @Expose() name: string
  @Expose() minPrice: number
  @Expose() maxPrice: number
  @Expose() sold: number

  @Expose()
  @Transform(params => (params.obj as Product).productFiles.map(e => e.file.name), {
    toClassOnly: true,
  })
  images: string[]
}
