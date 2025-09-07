import { Transform, Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

class ProductFilters {
  @IsOptional()
  @Max(100)
  @Min(0)
  @IsInt()
  minPrice: number

  @IsOptional()
  @Max(100)
  @Min(1)
  @IsInt()
  maxPrice: number
}

export default class SearchProductsDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoryId: number

  @IsOptional()
  @IsString()
  k: string

  @IsOptional()
  filters: ProductFilters

  @IsIn(['ctime', 'price', 'sales', 'pop'])
  by: 'ctime' | 'price' | 'sales' | 'pop'

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @Transform(params => ((params.value as string) ?? 'DESC').toUpperCase())
  order: 'ASC' | 'DESC'

  @IsOptional()
  @Min(0)
  @IsInt()
  @Type(() => Number)
  offset: number = 0

  @IsOptional()
  @Max(100)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  limit: number = 25

  @IsOptional()
  @Max(1000000000)
  @Min(0)
  @IsInt()
  @Type(() => Number)
  minPrice: number

  @IsOptional()
  @Max(1000000000)
  @Min(1000)
  @IsInt()
  @Type(() => Number)
  maxPrice: number
}
