import { ApiClassProperty } from '../../../utils/swagger-decorators'
import { MyAluno } from '../../alunos/entities/aluno.entity'
import { MyCampus } from '../../campi/entities/campus.entity'
import { MyCurso } from '../../cursos/entities/curso.entity'
import { MyTurma } from '../../turmas/entities/turma.entity'
import { MyUser } from '../../users/entities/user.entity'

export class MeDto {
  @ApiClassProperty(MyUser, { nullable: true })
  user: MyUser | null

  @ApiClassProperty(MyCampus, { nullable: true })
  campus: MyCampus | null

  @ApiClassProperty(MyAluno, { nullable: true })
  aluno: MyAluno | null

  @ApiClassProperty(MyTurma, { nullable: true })
  turma: MyTurma | null

  @ApiClassProperty(MyCurso, { nullable: true })
  curso: MyCurso | null
}
