import { OmitType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsDateString, IsIn, IsOptional, IsString, IsUUID } from 'class-validator'
import { InferSelectModel } from 'drizzle-orm'
import {
  ComprovanteContraturnoStatus,
  comprovanteContraturnoStatus,
  InscricaoStatus,
  inscricaoStatus,
  PresencaStatus,
  presencaStatus
} from '../../../drizzle/enums'
import { inscricoes } from '../../../drizzle/schemas/inscricao.schema'
import {
  ApiBooleanProperty,
  ApiClassProperty,
  ApiDateTimeProperty,
  ApiEnumProperty,
  ApiNonEmptyStringProperty,
  ApiStringProperty,
  ApiUUIDProperty
} from '../../../utils/swagger-decorators'
import { FullAluno } from '../../alunos/entities/aluno.entity'
import { BaseEntity } from '../../base/entities/base.entity'
import { Chamada } from '../../chamadas/entities/chamada.entity'
import { Curso } from '../../cursos/entities/curso.entity'
import { FlatTurma } from '../../turmas/entities/turma.entity'
import { User } from '../../users/entities/user.entity'

export class FullInscricao extends BaseEntity implements InferSelectModel<typeof inscricoes> {
  @ApiUUIDProperty()
  chamadaId: string

  @ApiUUIDProperty()
  @IsString()
  @IsUUID('loose')
  alunoId: string

  @ApiDateTimeProperty()
  dataHoraInscricao: Date

  @ApiDateTimeProperty({ nullable: true })
  @IsDateString()
  @IsOptional()
  dataHoraCancelamento: string | null

  @ApiEnumProperty(inscricaoStatus)
  @IsString()
  @IsIn(inscricaoStatus)
  status: InscricaoStatus

  @ApiBooleanProperty({ example: false })
  @IsBoolean()
  suap: boolean

  @ApiBooleanProperty({ example: false })
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  temAulaContraturno: boolean

  @ApiNonEmptyStringProperty({ nullable: true, example: '00000000-0000-0000-0000-000000000000.pdf' })
  documentoComprobatorio: string | null

  @ApiEnumProperty(comprovanteContraturnoStatus)
  @IsString()
  @IsIn(comprovanteContraturnoStatus)
  comprovanteContraturnoStatus: ComprovanteContraturnoStatus

  @ApiStringProperty({ nullable: true })
  @IsString()
  @IsOptional()
  justificativaRejeicaoComprovanteContraturno: string | null

  @ApiBooleanProperty()
  inseridoPeloGestor: boolean

  @ApiBooleanProperty()
  inseridoPeloColaborador: boolean

  @ApiEnumProperty(presencaStatus)
  @IsString()
  @IsIn(presencaStatus)
  presenca: PresencaStatus

  @ApiBooleanProperty()
  emListaEspera: boolean

  @ApiBooleanProperty()
  valida: boolean
}

export class Inscricao extends OmitType(FullInscricao, []) {}

export class InscricaoAluno extends OmitType(FullInscricao, ['inseridoPeloGestor', 'inseridoPeloColaborador']) {}

export class InscricaoComAluno {
  @ApiClassProperty(Inscricao)
  inscricao: Inscricao

  @ApiClassProperty(FullAluno)
  aluno: FullAluno

  @ApiClassProperty(User)
  usuario: User

  @ApiClassProperty(FlatTurma, { nullable: true })
  turma: FlatTurma | null

  @ApiClassProperty(Curso, { nullable: true })
  curso: Curso | null
}

export class InscricaoComAlunoEChamada extends InscricaoComAluno {
  chamada: Chamada
}
