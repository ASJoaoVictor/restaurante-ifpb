import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { and, eq, InferSelectModel } from 'drizzle-orm'
import { OAuth2Client } from 'google-auth-library'
import { env } from '../../config/env.config'
import { DRIZZLE } from '../../drizzle/drizzle.module'
import { DrizzleDB } from '../../drizzle/drizzle.types'
import { alunos, cursos, turmas, users } from '../../drizzle/schemas'
import { AlunosService } from '../alunos/alunos.service'
import { CampiService } from '../campi/campi.service'
import { MyCampus } from '../campi/entities/campus.entity'
import { CursosService } from '../cursos/cursos.service'
import { TurmasService } from '../turmas/turmas.service'
import { MyUser } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly usersService: UsersService,
    private readonly campiService: CampiService,
    private readonly jwtService: JwtService
  ) {}

  async loginWithGoogle(token: string) {
    if (!env.GOOGLE_CLIENT_ID) {
      throw new InternalServerErrorException('Google login is not configured')
    }

    const client = new OAuth2Client(env.GOOGLE_CLIENT_ID)

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    const email = payload?.email

    if (!email) throw new BadRequestException('O token não possui e-mail')
    const loginResponse = await this.loginWithEmail(email)

    // Update user photo if available
    if (payload.picture) {
      void this.usersService.update(loginResponse.me.user.id, loginResponse.me.user.campusId, {
        photoUrl: payload.picture
      })
    }

    return loginResponse
  }

  async loginWithEmail(email: string) {
    const user = await this.usersService.getOneByEmailWithCredentials(email)
    if (!user) throw new UnauthorizedException('Usuário não encontrado com este e-mail')
    return this.getLoginResponse(user)
  }

  private async getLoginResponse(user: InferSelectModel<typeof users>) {
    void this.usersService.update(user.id, user.campusId, { lastLoginAt: new Date().toISOString() })

    const myUser = await this.usersService.getMyUser(user.id)
    const myCampus = await this.campiService.getMyCampus(user.campusId)
    const myData = await this.getMyData(myUser, myCampus)

    return {
      jwt: this.getLoginJWT(user.id),
      me: { user: myUser!, campus: myCampus!, ...myData }
    }
  }

  private getLoginJWT(userID: string) {
    return this.jwtService.sign({}, { audience: 'auth', subject: userID, expiresIn: '30 days' })
  }

  async getMyData(user: MyUser | null, campus: MyCampus | null) {
    if (!user || !campus) {
      return {
        aluno: null,
        turma: null,
        curso: null
      }
    }

    const [result] = await this.db
      .select({
        aluno: AlunosService.getMyColumns(),
        turma: TurmasService.getMyColumns(),
        curso: CursosService.getMyColumns()
      })
      .from(users)
      .leftJoin(alunos, eq(alunos.usuarioId, users.id))
      .leftJoin(turmas, eq(alunos.turmaId, turmas.id))
      .leftJoin(cursos, eq(turmas.cursoId, cursos.id))
      .where(and(eq(users.id, user.id), eq(users.campusId, campus.id)))

    return result
  }
}
