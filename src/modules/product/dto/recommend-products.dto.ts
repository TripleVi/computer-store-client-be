import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export default class RecommendProductsDto {
  @IsString()
  section: 'you_may_also_like'

  @IsInt()
  categoryId: number

  @IsInt()
  productId: number

  @IsOptional()
  @Min(0)
  @IsInt()
  offset: number = 0

  @IsOptional()
  @Max(100)
  @Min(1)
  @IsInt()
  limit: number = 25
}
