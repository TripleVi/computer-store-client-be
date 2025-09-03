import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export default class GetCategoriesDto {
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @IsInt()
  offset: number = 0

  @IsOptional()
  @Type(() => Number)
  @Max(100)
  @Min(1)
  @IsInt()
  limit: number = 25

  @IsOptional()
  @IsString()
  include?: 'products'
}
