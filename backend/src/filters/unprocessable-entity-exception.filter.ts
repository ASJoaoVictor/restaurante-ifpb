import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, UnprocessableEntityException } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

@Catch(UnprocessableEntityException)
export class UnprocessableEntityExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: UnprocessableEntityException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const validationErrors = (exception.getResponse() as any)?.message as string[]
    const validationMessages = validationErrors?.map?.((error) => `• ${error}`).join('\n') || exception.message

    const responseBody = {
      message: validationMessages,
      error: 'Unprocessable Entity',
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }

    // Send the response
    if (!httpAdapter.isHeadersSent(response)) {
      httpAdapter.reply(response, responseBody, responseBody.statusCode)
    } else {
      httpAdapter.end(response)
    }
  }
}
