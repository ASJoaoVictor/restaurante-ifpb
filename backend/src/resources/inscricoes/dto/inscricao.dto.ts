import { PartialType, PickType } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'
import { ApiClassProperty, ApiFileProperty, ApiUUIDProperty } from '../../../utils/swagger-decorators'
import { FullInscricao, Inscricao, InscricaoAluno } from '../entities/inscricao.entity'
import { Aluno } from '../../alunos/entities/aluno.entity'

export class CreateInscricaoDto extends PickType(InscricaoAluno, ['temAulaContraturno']) {
  @ApiFileProperty({ required: false })
  @IsOptional()
  file: Express.Multer.File
}

export class UpdateInscricaoDto extends PartialType(
  PickType(FullInscricao, [
    'dataHoraCancelamento',
    'status',
    'suap',
    'comprovanteContraturnoStatus',
    'justificativaRejeicaoComprovanteContraturno',
    'presenca'
  ])
) {}

export class VerificarPresencaParamsDto {
  @ApiUUIDProperty()
  @IsString()
  @IsUUID('loose')
  chamadaId: string

  @ApiUUIDProperty()
  @IsString()
  @IsUUID('loose')
  alunoId: string
}

export class VerificarPresencaResponseDto {
  @ApiClassProperty(Aluno)
  aluno: Aluno

  @ApiClassProperty(Inscricao, { nullable: true })
  inscricao: Inscricao | null
}

export class MarcarPresencaDto extends PickType(InscricaoAluno, ['presenca']) {}

export class MarcarPresencaForaDaListaDto extends PickType(InscricaoAluno, ['alunoId']) {}

export class AvaliarDocumentoComprobatorioDto extends PickType(InscricaoAluno, [
  'comprovanteContraturnoStatus',
  'justificativaRejeicaoComprovanteContraturno'
]) {}
