import { Inject, Injectable } from '@nestjs/common'
import { DRIZZLE } from '../../drizzle/drizzle.module'
import { DrizzleDB } from '../../drizzle/drizzle.types'
import { errorReports } from '../../drizzle/schemas'
import { MyUser } from '../users/entities/user.entity'
import { ReportErrorDto } from './dto/error-reporting.dto'

@Injectable()
export class InternalService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async reportError(data: ReportErrorDto, authUser: MyUser, userAgent?: string, userIP?: string) {
    await this.db.insert(errorReports).values({
      time: new Date().toISOString(),
      name: data.name,
      message: data.message,
      stack: data.stack,
      url: data.url,
      userAgent: userAgent || null,
      userIP: userIP || null,
      userId: authUser?.id || null
    })
  }
}
