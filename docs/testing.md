# Testagem

A testagem é uma parte essencial do desenvolvimento de software, garantindo que o código funcione conforme o esperado e ajudando a prevenir regressões. Nesta seção, abordaremos como configurar e escrever testes para a aplicação.

## Tipos de testes

1. **Testes de tipagem (TypeScript)**\
   Verificam se o código está correto em termos de tipos.

   ```bash
   bun run test:types
   ```

2. **Testes unitários**\
   Testam funções ou classes isoladas.

   ```bash
   bun run test:unit
   ```

3. **Testes end-to-end (E2E)**\
   Testam o comportamento do sistema completo, simulando requisições HTTP.

   ```bash
   bun run test:e2e
   ```

Para rodar todos os testes de uma vez:

```bash
bun run test
```

> ⚠️ Testes unitários e E2E precisam de um banco de dados PostgreSQL. Crie um banco de testes pois ele será apagado e recriado a cada execução.

## Configuração do banco de testes

1. Entre no console do PostgreSQL:

   ```bash
   psql postgres://postgres:root@localhost:5432/postgres
   ```

2. Crie o banco:

   ```sql
   CREATE DATABASE meals_test;
   ```

3. Configure a variável de ambiente `DATABASE_URL` em `backend/.env.test.local`:

   ```ini
   DATABASE_URL=postgres://postgres:root@localhost:5432/meals_test
   ```

## Criando testes

### Testes unitários

- Nome do arquivo: `<nome-do-modulo>.spec.ts`
- Coloque na mesma pasta do módulo que será testado.

Exemplo: `backend/src/resources/alunos/alunos.spec.ts`

```ts
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../app.module'
import { AlunosService } from './alunos.service'

describe('alunos', () => {
  let moduleRef: TestingModule
  let service: AlunosService

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile()
    service = await moduleRef.resolve(AlunosService)
  })

  afterAll(async () => {
    await moduleRef.close()
  })

  // Coloque os testes aqui
  it('contagem de alunos retorna número', async () => {
    const count = await service.count('00000000-0000-0000-0000-000000000000')
    expect(typeof count).toBe('number')
  })
})
```

### Testes end-to-end

- Nome do arquivo: `<nome-do-modulo>.e2e-spec.ts`
- Se não for específico de módulo, use `backend/src/tests`.

Exemplo: `backend/src/tests/alunos.e2e-spec.ts`

```ts
import { NestExpressApplication } from '@nestjs/platform-express'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../app.module'
import { setupApp } from '../../config/app.config'
import request from 'supertest'

describe('alunos e2e', () => {
  let moduleRef: TestingModule
  let app: NestExpressApplication

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile()
    app = moduleRef.createNestApplication()
    setupApp(app)
    await app.init()
  })

  afterAll(async () => {
    await moduleRef.close()
  })

  // Coloque os testes aqui
  it('listagem de alunos não deve ser acessada por usuário não autenticado', async () => {
    await request(app.getHttpServer()).get('/api/alunos').expect(401)
  })
})
```
