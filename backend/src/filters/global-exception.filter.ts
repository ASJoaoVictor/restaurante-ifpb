import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  IntrinsicException,
  Logger
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { MESSAGES } from '@nestjs/core/constants'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionsHandler')

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    // Default response body is set to an internal server error
    const responseBody = {
      message: null as string | null,
      error: MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR
    }

    // Catch HttpException and set the response body accordingly
    if (exception instanceof HttpException) {
      responseBody.statusCode = exception.getStatus()
      responseBody.message = exception.message

      // If the "error" property is not set, use the message as the error
      const response = exception.getResponse()
      if (typeof response === 'object') {
        responseBody.error = 'error' in response ? (response.error as string) : exception.message
      }

      // If the error is the same as the message, set message to null
      if (responseBody.error === responseBody.message) {
        responseBody.message = null
      }
    }

    // Send the response
    if (!httpAdapter.isHeadersSent(response)) {
      httpAdapter.reply(response, responseBody, responseBody.statusCode)
    } else {
      httpAdapter.end(response)
    }

    // Log the exception if it's not an IntrinsicException
    // IntrinsicException is used for errors that should not be logged
    if (!(exception instanceof IntrinsicException)) {
      this.logger.error(exception)
    }
  }
}
