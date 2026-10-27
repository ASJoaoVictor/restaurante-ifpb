import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { ThrottlerException } from '@nestjs/throttler'

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: ThrottlerException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const responseBody = {
      message: 'Too Many Requests',
      error: 'Too Many Requests',
      statusCode: HttpStatus.TOO_MANY_REQUESTS
    }

    // Send the response
    if (!httpAdapter.isHeadersSent(response)) {
      httpAdapter.reply(response, responseBody, responseBody.statusCode)
    } else {
      httpAdapter.end(response)
    }
  }
}
