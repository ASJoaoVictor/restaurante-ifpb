import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { DrizzleQueryError } from 'drizzle-orm'

@Catch(DrizzleQueryError)
export class DrizzleQueryErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionsHandler')

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: DrizzleQueryError, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const responseBody = {
      message: (exception.cause as any)?.detail || null,
      error: 'Database Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR
    }

    // Send the response
    if (!httpAdapter.isHeadersSent(response)) {
      httpAdapter.reply(response, responseBody, responseBody.statusCode)
    } else {
      httpAdapter.end(response)
    }

    // Log the exception
    this.logger.error(exception)
  }
}
