import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { staticConfig } from './config/static.config'
import { throttlerConfig } from './config/throttler.config'
import { DrizzleQueryErrorFilter } from './filters/drizzle-query-error.filter'
import { GlobalExceptionFilter } from './filters/global-exception.filter'
import { ThrottlerExceptionFilter } from './filters/throttler-exception.filter'
import { UnprocessableEntityExceptionFilter } from './filters/unprocessable-entity-exception.filter'
import { AuthUserMiddleware } from './middlewares/authuser.middleware'
import { CampusMiddleware } from './middlewares/campus.middleware'
import { AlunosModule } from './resources/alunos/alunos.module'
import { AuthModule } from './resources/auth/auth.module'
import { CampiModule } from './resources/campi/campi.module'
import { ChamadasModule } from './resources/chamadas/chamadas.module'
import { CommonModule } from './resources/common/common.module'
import { CursosModule } from './resources/cursos/cursos.module'
import { EmailModule } from './resources/email/email.module'
import { InscricoesModule } from './resources/inscricoes/inscricoes.module'
import { InternalModule } from './resources/internal/internal.module'
import { NotificacoesModule } from './resources/notificacoes/notificacoes.module'
import { RefeicoesModule } from './resources/refeicoes/refeicoes.module'
import { TurmasModule } from './resources/turmas/turmas.module'
import { UsersModule } from './resources/users/users.module'

@Module({
  imports: [
    ServeStaticModule.forRoot(staticConfig),
    ThrottlerModule.forRoot(throttlerConfig),
    AuthModule,
    UsersModule,
    AlunosModule,
    CampiModule,
    CursosModule,
    InscricoesModule,
    RefeicoesModule,
    TurmasModule,
    ChamadasModule,
    CommonModule,
    EmailModule,
    NotificacoesModule,
    InternalModule
  ],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_FILTER, useClass: ThrottlerExceptionFilter },
    { provide: APP_FILTER, useClass: UnprocessableEntityExceptionFilter },
    { provide: APP_FILTER, useClass: DrizzleQueryErrorFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthUserMiddleware).forRoutes('/*path')
    consumer.apply(CampusMiddleware).forRoutes('/*path')
  }
}
