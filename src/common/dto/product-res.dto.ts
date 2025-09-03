import { Expose, Transform } from 'class-transformer'

export class ProductResDto {
  @Expose() id: number
  @Expose() name: string
  @Expose() categoryId: number
  @Expose() minPrice: number
  @Expose() maxPrice: number

  @Expose()
  @Transform(params => Number(params.value ?? 0))
  quantity: number

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
  thumbnails: string[]
}
