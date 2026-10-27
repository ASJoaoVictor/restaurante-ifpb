import { IsDateString, IsOptional, IsString } from 'class-validator'
import { InferSelectModel } from 'drizzle-orm'
import { errorReports } from '../../../drizzle/schemas'
import { ApiDateTimeProperty, ApiStringProperty, ApiURLProperty } from '../../../utils/swagger-decorators'
import { BaseEntity } from '../../base/entities/base.entity'

export class FullErrorReport extends BaseEntity implements InferSelectModel<typeof errorReports> {
  @ApiDateTimeProperty({ nullable: true })
  @IsString()
  @IsOptional()
  @IsDateString({ strict: true })
  time: string | null

  @ApiStringProperty({ example: 'Error', nullable: true })
  @IsString()
  @IsOptional()
  name: string | null

  @ApiStringProperty({ example: 'An error occurred', nullable: true })
  @IsString()
  @IsOptional()
  message: string | null

  @ApiStringProperty({ example: 'Error stack trace', nullable: true })
  @IsString()
  @IsOptional()
  stack: string | null

  @ApiStringProperty({ example: 'frontend-crash', nullable: true })
  @IsString()
  @IsOptional()
  type: string | null

  @ApiStringProperty({ example: '{}', nullable: true })
  @IsString()
  @IsOptional()
  details: string | null

  @ApiURLProperty({ nullable: true })
  @IsString()
  @IsOptional()
  url: string | null

  userAgent: string | null

  userIP: string | null

  userId: string | null
}
