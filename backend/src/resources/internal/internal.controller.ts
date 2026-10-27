import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { Request } from 'express'
import { AuthUser } from '../auth/auth-user.decorator'
import { MyUser } from '../users/entities/user.entity'
import { ReportErrorDto } from './dto/error-reporting.dto'
import { HealthCheckDto } from './dto/health-check.dto'
import { InternalService } from './internal.service'

@ApiTags('internal')
@Controller('internal')
export class InternalController {
  constructor(private readonly internalService: InternalService) {}

  @Get('/health-check')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: HealthCheckDto })
  async healthCheck(): Promise<HealthCheckDto> {
    return { status: 'OK' }
  }

  @Post('/report-error')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @Throttle({ byIP: { limit: 10, ttl: 60000 } })
  async reportError(
    @Body() data: ReportErrorDto,
    @Req() req: Request,
    @AuthUser() authUser: MyUser,
    @Headers('user-agent') userAgent?: string
  ): Promise<void> {
    return this.internalService.reportError(data, authUser, userAgent, req.ip)
  }
}
