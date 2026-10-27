import { Transform } from 'class-transformer'
import { IsIn, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { MAX_PAGE, MAX_PAGE_SIZE } from '../../../utils/pagination'
import {
  ApiEnumProperty,
  ApiNonEmptyStringProperty,
  ApiNumberProperty,
  ApiStringProperty
} from '../../../utils/swagger-decorators'

export class QueryOptionsDto {
  @ApiNumberProperty({ minimum: 1, maximum: MAX_PAGE, example: 1 })
  @IsNumber()
  @Min(1)
  @Max(MAX_PAGE)
  @Transform(({ value }) => parseInt(value, 10))
  page: number

  @ApiNumberProperty({ minimum: 1, maximum: MAX_PAGE_SIZE, example: 10 })
  @IsNumber()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  @Transform(({ value }) => parseInt(value, 10))
  pageSize: number

  @ApiNonEmptyStringProperty({ example: 'name', required: false })
  @IsString()
  @IsOptional()
  orderBy?: string

  @ApiEnumProperty(['asc', 'desc'], { required: false })
  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  orderDirection: 'asc' | 'desc' = 'asc'

  @ApiStringProperty({ example: 'João', required: false })
  @IsString()
  @IsOptional()
  search?: string
}
