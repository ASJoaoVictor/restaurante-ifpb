import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger(LoggingMiddleware.name)

  use(req: Request, _: Response, next: () => void) {
    const { method, originalUrl, headers } = req
    const ip = headers['x-real-ip'] || req.ip
    const appVersion = headers['app-version'] || 'Não informado'
    const userAgent = headers['user-agent'] || 'desconhecido'
    if (!headers['content-type']) {
      headers['content-type'] = 'application/json'
    }

    const message = `${appVersion} - ${method} ${originalUrl} - ${ip} - ${userAgent}`
    this.logger.log(message)

    next()
  }
}
