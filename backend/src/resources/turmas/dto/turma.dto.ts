import { OmitType, PartialType, PickType } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator'
import { ApiEnumProperty } from '../../../utils/swagger-decorators'
import { QueryOptionsDto } from '../../base/dto/query-options.dto'
import { Turma } from '../entities/turma.entity'
import { TurmasService } from '../turmas.service'

export class CreateTurmaDto extends PickType(Turma, ['periodo', 'turma', 'diasContraturno', 'turno', 'cursoId']) {}

export class UpdateTurmaDto extends PartialType(CreateTurmaDto) {}

export type TurmaOrderBy = (typeof TurmasService.orderingFields)[number]

export class TurmaQueryOptionsDto extends OmitType(QueryOptionsDto, ['orderBy']) {
  @ApiEnumProperty(TurmasService.orderingFields, { required: false })
  @IsString()
  @IsIn(TurmasService.orderingFields)
  @IsOptional()
  orderBy?: TurmaOrderBy
}
