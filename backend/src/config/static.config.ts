import { ServeStaticModuleOptions } from '@nestjs/serve-static'

export const STATIC_URL = '/api/public'

export const staticConfig: ServeStaticModuleOptions = {
  rootPath: 'public',
  serveRoot: `${STATIC_URL}/`
}
