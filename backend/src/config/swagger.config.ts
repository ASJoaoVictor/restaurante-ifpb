import { DocumentBuilder, OpenAPIObject, SwaggerCustomOptions } from '@nestjs/swagger'
import { env } from './env.config'
import { STATIC_URL } from './static.config'

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('authentication', 'Autenticação')
  .addTag('users', 'Gerenciamento de usuários')
  .addTag('alunos', 'Gerenciamento de alunos')
  .addTag('cursos', 'Gerenciamento de cursos')
  .addTag('turmas', 'Gerenciamento de turmas')
  .addTag('refeicoes', 'Gerenciamento de refeições')
  .addTag('chamadas', 'Gerenciamento de chamadas')
  .addTag('inscricoes', 'Gerenciamento de inscrições')
  .addTag('storage', 'Arquivos')
  .addTag('internal', 'Rotas internas')
  .build()

export const swaggerOptions: SwaggerCustomOptions = {
  customSiteTitle: 'API',
  customCssUrl: [`${STATIC_URL}/swagger/swagger.css`],
  customJs: [`${STATIC_URL}/swagger/swagger.js`],
  jsonDocumentUrl: '/api/json',
  swaggerOptions: {
    persistAuthorization: true,
    tryItOutEnabled: true,
    requestSnippetsEnabled: true,
    requestSnippets: { defaultExpanded: false },
    defaultModelsExpandDepth: -1,
    docExpansion: 'none'
  }
}

// If running on Vercel, use CDN for Swagger UI assets
if (env.VERCEL) {
  const cssURLs = swaggerOptions.customCssUrl as string[]
  const jsURLs = swaggerOptions.customJs as string[]
  cssURLs.push('https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.27.1/swagger-ui.min.css')
  jsURLs.push('https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.27.1/swagger-ui-bundle.min.js')
  jsURLs.push('https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.27.1/swagger-ui-standalone-preset.min.js')
}

export function parseSwaggerDocument(document: OpenAPIObject) {
  for (const path in document.paths) {
    for (const method in document.paths[path]) {
      type Method = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'
      const operation = document.paths[path][method as Method]
      if (!operation?.parameters) continue

      // Remove authentication on public routes (/src/auth/auth.decorator.ts)
      if (operation.security?.includes('public' as any)) {
        operation.security = []
      }

      // Remove "Controller" suffix from operationId
      operation.operationId = operation.operationId?.replace('Controller', '')
    }
  }
}
