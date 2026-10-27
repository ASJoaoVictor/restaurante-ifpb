import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'
import {
  ApiBooleanProperty,
  ApiClassProperty,
  ApiEnumProperty,
  ApiFileProperty,
  ApiNumberProperty,
  ApiStringArrayProperty,
  ApiStringProperty,
  ApiUUIDProperty
} from '../../../utils/swagger-decorators'
import { QueryOptionsDto } from '../../base/dto/query-options.dto'
import { User } from '../../users/entities/user.entity'
import { AlunosService } from '../alunos.service'
import { Aluno } from '../entities/aluno.entity'

export class CreateAlunoUsuarioDto extends PickType(User, ['name', 'email', 'phone']) {}

export class CreateAlunoDto extends PickType(Aluno, [
  'matricula',
  'observacoes',
  'cidade',
  'estado',
  'turmaId',
  'possuiNEE'
]) {
  @ApiClassProperty(CreateAlunoUsuarioDto)
  @IsObject()
  @Type(() => CreateAlunoUsuarioDto)
  @ValidateNested()
  usuario: CreateAlunoUsuarioDto

  @ApiStringArrayProperty()
  @IsString({ each: true })
  @IsArray()
  refeicoesRestritas: string[]
}

export class UpdateAlunoDto extends OmitType(
  PartialType(IntersectionType(CreateAlunoDto, PickType(Aluno, ['faltas', 'suspensoAte']))),
  ['usuario']
) {
  @ApiClassProperty(PartialType(CreateAlunoUsuarioDto))
  @IsObject()
  @IsNotEmptyObject()
  @IsOptional()
  @Type(() => PartialType(CreateAlunoUsuarioDto))
  @ValidateNested()
  usuario?: Partial<CreateAlunoUsuarioDto>
}

export class ImportarAlunosDto {
  @ApiFileProperty()
  file: Express.Multer.File

  @ApiBooleanProperty({ example: true })
  @IsBoolean()
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : undefined))
  excluirAlunosNaoListados: boolean
}

export class ImportarAlunosResponseDto {
  @ApiNumberProperty({ example: 600 })
  alunosImportados: number

  @ApiNumberProperty({ example: 50 })
  alunosNaoMatriculados: number

  @ApiNumberProperty({ example: 10 })
  alunosRemovidos: number

  @ApiNumberProperty({ example: 2 })
  alunosSemEmailAcademico: number
}

export class AlunoQRCodeDto {
  @ApiNumberProperty({ example: 1 })
  version: number

  @ApiUUIDProperty()
  id: string

  @ApiStringProperty()
  signature: string
}

export class ControleDeFaltasAlunoDto extends PickType(Aluno, ['faltas']) {}

export type AlunoOrderBy = (typeof AlunosService.orderingFields)[number]

export class AlunoQueryOptionsDto extends OmitType(QueryOptionsDto, ['orderBy']) {
  @ApiEnumProperty(AlunosService.orderingFields, { required: false })
  @IsString()
  @IsIn(AlunosService.orderingFields)
  @IsOptional()
  orderBy?: AlunoOrderBy
}
