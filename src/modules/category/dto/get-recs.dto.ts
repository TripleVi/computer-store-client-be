import { IsInt, IsOptional, Max, Min } from 'class-validator'

export default class GetRecsDto {
  @IsOptional()
  @Min(0)
  @IsInt()
  offset: number = 0

  @IsOptional()
  @Max(100)
  @Min(1)
  @IsInt()
  limit: number = 12
}
