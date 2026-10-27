import { NextFunction, Request, Response } from 'express'
import { HelmetOptions } from 'helmet'
import _ from 'lodash'
import { env } from './env.config'

export const helmetOptions: HelmetOptions = {}

if (env.NODE_ENV === 'development') {
  _.merge(helmetOptions, {
    contentSecurityPolicy: {
      directives: {
        'frame-ancestors': ["*"]
      }
    }
  })
}

// Use CDN for assets if running on Vercel
if (env.VERCEL) {
  _.merge(helmetOptions, {
    contentSecurityPolicy: {
      directives: {
        'script-src': ["'self'", 'https://cdnjs.cloudflare.com'],
        'frame-ancestors': ["*"]
      }
    }
  })
}

export function customHelmetHeaders(req: Request, res: Response, next: NextFunction) {
  // Add Permissions-Policy header
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()')
  next()
}
