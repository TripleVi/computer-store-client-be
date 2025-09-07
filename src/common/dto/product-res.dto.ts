import { Expose, Transform } from 'class-transformer'

export class ProductResDto {
  @Expose() id: number
  @Expose() name: string
  @Expose() categoryId: number
  @Expose() minPrice: number
  @Expose() maxPrice: number
  @Expose() sold: number

  @Expose()
  @Transform(
    params => {
      const obj = params.obj as Record<string, any>
      return Object.keys(obj)
        .filter(key => key.startsWith('thumb'))
        .map(key => obj[key] as string)
    },
    { toClassOnly: true }
  )
  images: string[]
}
