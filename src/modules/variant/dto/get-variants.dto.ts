import { Transform, Type } from 'class-transformer'
import { IsArray, IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator'

export default class GetVariantsDto {
  @IsNumber({}, { each: true })
  @IsArray()
  @Transform(params => {
    const value = params.value as string
    const arr = value.split(',').map(v => v.trim())
    if (arr.includes('')) return value
    return arr.map(v => +v)
  })
  ids: number[]

  @Max(100)
  @Min(0)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit: number

  @Min(0)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset: number
}
