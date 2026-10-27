import { OmitType, PartialType, PickType } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator'
import { ApiEnumProperty } from '../../../utils/swagger-decorators'
import { QueryOptionsDto } from '../../base/dto/query-options.dto'
import { CursosService } from '../cursos.service'
import { Curso } from '../entities/curso.entity'

export class CreateCursoDto extends PickType(Curso, ['nome', 'nomeCurto', 'numeroCurso']) {}

export class UpdateCursoDto extends PartialType(CreateCursoDto) {}

export type CursoOrderBy = (typeof CursosService.orderingFields)[number]

export class CursoQueryOptionsDto extends OmitType(QueryOptionsDto, ['orderBy']) {
  @ApiEnumProperty(CursosService.orderingFields, { required: false })
  @IsString()
  @IsIn(CursosService.orderingFields)
  @IsOptional()
  orderBy?: CursoOrderBy
}
