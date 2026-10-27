import { ClassSerializerInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule } from '@nestjs/swagger'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { customHelmetHeaders, helmetOptions } from '../config/helmet.config'
import { parseSwaggerDocument, swaggerConfig, swaggerOptions } from '../config/swagger.config'
import { validationPipe } from '../config/validation.config'
import { env } from './env.config'

export function setupApp(app: NestExpressApplication) {
  // Habilita CORS apenas em desenvolvimento, já que em produção o front-end e o back-end estarão no mesmo domínio
  if (env.NODE_ENV === 'development' || env.VERCEL) {
    app.enableCors({ credentials: true, exposedHeaders: '*', origin: true })
  }

  app.set('trust proxy', 'loopback')
  app.useGlobalPipes(validationPipe)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.use(compression())
  app.use(helmet(helmetOptions))
  app.use(customHelmetHeaders)
  app.use(cookieParser())
  app.setGlobalPrefix('api')

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  parseSwaggerDocument(document)
  SwaggerModule.setup('api', app, document, swaggerOptions)
}
