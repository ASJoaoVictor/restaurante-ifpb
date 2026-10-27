import { Inject } from '@nestjs/common'
import dayjs from 'dayjs'
import { and, eq, isNull, or } from 'drizzle-orm'
import { PgColumn } from 'drizzle-orm/pg-core'
import { DRIZZLE } from '../../drizzle/drizzle.module'
import { DrizzleDB } from '../../drizzle/drizzle.types'
import { alunos, campi, chamadas, cursos, inscricoes, turmas, users } from '../../drizzle/schemas'
import { preferenciasNotificacoes } from '../../drizzle/schemas/preferencia-notificacao.schema'
import { AlunosService } from '../alunos/alunos.service'
import { ChamadasService } from '../chamadas/chamadas.service'
import { CursosService } from '../cursos/cursos.service'
import { EmailService } from '../email/email.service'
import { ChamadaAbertaEmail } from '../email/templates/chamada-aberta'
import { ComprovanteRejeitadoEmail } from '../email/templates/comprovante-rejeitado'
import { FaltaAlunoEmail } from '../email/templates/falta-aluno'
import { ResultadoChamadaEmail } from '../email/templates/resultado-chamada'
import { SuspensaoAlunoEmail } from '../email/templates/suspensao-aluno'
import { InscricoesService } from '../inscricoes/inscricoes.service'
import { TurmasService } from '../turmas/turmas.service'
import { UsersService } from '../users/users.service'

export class NotificacoesService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly emailService: EmailService
  ) {}

  async notificarChamadaAberta(chamadaId: string) {
    const [chamada] = await this.db.select().from(chamadas).where(eq(chamadas.id, chamadaId)).limit(1)
    const { email, whatsapp } = await this.buscarAlunosPorPlataforma(chamada.refeicaoId)

    const emails = email.map((aluno) => aluno.email)

    await this.emailService.sendEmailTemplate(
      ChamadaAbertaEmail,
      { chamada },
      {
        bcc: emails,
        subject: `Inscrições abertas para ${chamada.nome} (${dayjs(chamada.data).format('DD [de] MMM')})`
      }
    )
  }

  async notificarResultado(chamadaId: string) {
    const [chamada] = await this.db.select().from(chamadas).where(eq(chamadas.id, chamadaId)).limit(1)

    const alunosInscritos = await this.db
      .select({ email: users.email })
      .from(alunos)
      .innerJoin(inscricoes, eq(inscricoes.alunoId, alunos.id))
      .innerJoin(users, eq(users.id, alunos.usuarioId))
      .where(and(eq(inscricoes.chamadaId, chamadaId), isNull(inscricoes.dataHoraCancelamento)))

    const emails = alunosInscritos.map((aluno) => aluno.email)

    await this.emailService.sendEmailTemplate(
      ResultadoChamadaEmail,
      { chamada },
      {
        bcc: emails,
        subject: `Resultado divulgado para ${chamada.nome} (${dayjs(chamada.data).format('DD [de] MMM')})`
      }
    )
  }

  async notificarComprovanteRejeitado(inscricaoId: string) {
    const [inscricao] = await this.db
      .select({
        inscricao: InscricoesService.getFlatColumns(),
        aluno: AlunosService.getFlatColumns(),
        usuario: UsersService.getFlatColumns(),
        turma: TurmasService.getFlatColumns(),
        curso: CursosService.getFlatColumns(),
        chamada: ChamadasService.getFlatColumns()
      })
      .from(inscricoes)
      .innerJoin(alunos, eq(inscricoes.alunoId, alunos.id))
      .innerJoin(users, eq(users.id, alunos.usuarioId))
      .innerJoin(chamadas, eq(chamadas.id, inscricoes.chamadaId))
      .leftJoin(turmas, eq(turmas.id, alunos.turmaId))
      .leftJoin(cursos, eq(cursos.id, turmas.cursoId))
      .where(eq(inscricoes.id, inscricaoId))
      .limit(1)

    if (!inscricao) return

    await this.emailService.sendEmailTemplate(
      ComprovanteRejeitadoEmail,
      { inscricao },
      {
        to: inscricao.usuario.email,
        subject: `O comprovante que você enviou para o ${inscricao.chamada.nome} do dia ${dayjs(inscricao.chamada.data).format('DD [de] MMMM')} foi rejeitado`
      }
    )
  }

  async notificarFalta(alunoId: string) {
    const { aluno, campus } = await this.obterAlunoECampus(alunoId)

    if (!aluno) return
    if (aluno.faltas <= 0) return

    await this.emailService.sendEmailTemplate(
      FaltaAlunoEmail,
      { aluno, maximoDeFaltas: campus.maximoDeFaltas },
      {
        to: aluno.usuario.email,
        subject: `Você possui ${aluno.faltas}/${campus.maximoDeFaltas} faltas no restaurante`
      }
    )
  }

  async notificarSuspensao(alunoId: string) {
    const { aluno, campus } = await this.obterAlunoECampus(alunoId)

    if (!aluno) return

    await this.emailService.sendEmailTemplate(
      SuspensaoAlunoEmail,
      { aluno, maximoDeFaltas: campus.maximoDeFaltas, diasDeSuspensao: campus.diasDeSuspensao },
      {
        to: aluno.usuario.email,
        subject: `Você foi suspenso do restaurante estudantil por ${campus.diasDeSuspensao} dias por atingir ${campus.maximoDeFaltas} faltas`
      }
    )
  }

  private async obterAlunoECampus(alunoId: string) {
    const [aluno] = await this.db
      .select(AlunosService.getColumns())
      .from(alunos)
      .innerJoin(users, eq(alunos.usuarioId, users.id))
      .leftJoin(turmas, eq(alunos.turmaId, turmas.id))
      .leftJoin(cursos, eq(turmas.cursoId, cursos.id))
      .where(and(eq(alunos.id, alunoId)))

    const [campus] = await this.db
      .select({ maximoDeFaltas: campi.maximoDeFaltas, diasDeSuspensao: campi.diasDeSuspensao })
      .from(campi)
      .where(eq(campi.id, aluno.usuario.campusId))
      .limit(1)

    return { aluno, campus }
  }

  private async alunosPreferenciaNotificacao(refeicaoId: string | null, coluna: PgColumn) {
    const alunosEncontrados = await this.db
      .select({ email: users.email })
      .from(alunos)
      .leftJoin(preferenciasNotificacoes, eq(preferenciasNotificacoes.alunoId, alunos.id))
      .innerJoin(users, eq(users.id, alunos.usuarioId))
      .where(
        or(
          // Alunos que configuraram a preferência de notificação
          and(
            refeicaoId === null
              ? isNull(preferenciasNotificacoes.refeicaoId) // Caso a refeição não seja informada, verificar a preferência por "outras refeições"
              : eq(preferenciasNotificacoes.refeicaoId, refeicaoId), // Caso a refeição seja informada, verificar a preferência por aquela refeição específica

            eq(coluna, true) // Verificar a preferência pela plataforma (e-mail ou WhatsApp)
          ),

          // Alunos que não configuraram a preferência de notificação receberão por padrão
          isNull(preferenciasNotificacoes.id)
        )
      )

    return alunosEncontrados
  }

  private async buscarAlunosPorPlataforma(refeicaoId: string | null) {
    const email = await this.alunosPreferenciaNotificacao(refeicaoId, preferenciasNotificacoes.porEmail)
    const whatsapp = await this.alunosPreferenciaNotificacao(refeicaoId, preferenciasNotificacoes.porWhatsApp)
    return { email, whatsapp }
  }
}
