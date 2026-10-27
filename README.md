# 🍴 Sistema de Restaurante Estudantil do IFPB

Este repositório contém o código-fonte para o sistema de restaurante estudantil do IFPB, que tem como objetivo facilitar a gestão de pedidos e o controle de refeições para os alunos.

<br />

## Tecnologias utilizadas

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Orval](https://img.shields.io/badge/Orval-45239b?style=for-the-badge&logo=orval&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-%23C5F74F.svg?style=for-the-badge&logo=drizzle&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Chakra](https://img.shields.io/badge/chakra-%234ED1C5.svg?style=for-the-badge&logo=chakraui&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)

<br />

## Instalação

### Softwares

Para o funcionamento adequado do sistema, é necessário ter os seguintes softwares instalados:

| Software      | Descrição                       | Link de download                     |
| ------------- | ------------------------------- | ------------------------------------ |
| Git           | Controle de versão              | https://git-scm.com/downloads        |
| Node.js 22    | Ambiente de execução JavaScript | https://nodejs.org/en/download/      |
| Bun           | Gerenciador de pacotes          | https://bun.sh/                      |
| PostgreSQL 17 | Banco de dados relacional       | https://www.postgresql.org/download/ |

> **Observação:** Para simplificar o processo de configuração, defina a senha do PostgreSQL para `root`.

### Download do repositório

Para baixar o repositório, abra o terminal e execute o seguinte comando:

```bash
git clone https://github.com/josejefferson/restaurante-ifpb/
cd restaurante-ifpb
```

> **Observação:** Pode ser necessário configurar as credenciais de acesso ao repositório remoto

### Instalação das bibliotecas

Dentro do diretório do projeto, execute os seguintes comandos para instalar as dependências:

```bash
cd backend
bun install
cd ..

cd frontend
bun install
cd ..

cd orval
bun install
cd ..
```

### Configuração das variáveis de ambiente

Dentro da pasta `backend` e também dentro da pasta `frontend` crie um arquivo com o nome `.env`

Abra o arquivo `.env.example` de cada pasta e copie o conteúdo dele para o `.env` correspondente

#### Banco de dados

No arquivo [backend/.env](backend/.env), adicione a chave `DATABASE_URL` com a URL de conexão do PostgreSQL. O formato é: `postgres://<usuario>:<senha>@<host>:<porta>/<banco_de_dados>`

Por exemplo:

```ini
# backend/.env
DATABASE_URL=postgres://postgres:root@localhost:5432/restaurante
```

É necessário criar o banco de dados no PostgreSQL. Para isso você pode executar os seguintes comandos:

```bash
psql postgres://postgres:root@localhost:5432/postgres
```

Em seguida, dentro do prompt do PostgreSQL, execute:

```sql
CREATE DATABASE restaurante;
```

#### Credenciais do Google para OAuth

> [!IMPORTANT]  
> Antes de rodar o projeto, é necessário obter um **OAuth 2.0 Client ID**, pois o sistema utiliza autenticação via Google.  
> [Veja como obter as credenciais](./docs/001-credenciais-google-OAuth.md).

#### Credenciais do Gmail

> [!IMPORTANT]  
> Para enviar e-mails pelo sistema, você deve obter credenciais do Gmail.  
> [Veja como obter as credenciais](./docs/002-credenciais-gmail.md).

#### API endpoint

<br />

## Execução em modo desenvolvimento

Abra dois terminais na pasta do projeto:

No primeiro terminal, execute o back-end:

```bash
cd backend
bun run dev
```

No segundo terminal, execute o front-end:

```bash
cd frontend
bun run dev
```

<br />

## Portas e endpoints

### Aplicação

| Componente | Porta padrão | URL                       |
| ---------- | ------------ | ------------------------- |
| Back-end   | 3000         | http://localhost:3000/api |
| Front-end  | 5173         | http://localhost:5173     |

<br />

## Comandos

### Migrações do banco de dados

Para criar ou atualizar as tabelas do banco de dados, utilize os comandos de migração disponíveis no diretório `backend`. Certifique-se de que o banco de dados já está criado e configurado corretamente.

#### Comandos disponíveis

- **Gerar migração automaticamente**

  ```bash
  bun run db:migrations-gen
  ```

  Gera arquivos de migração com base nas alterações detectadas no schema do projeto.

- **Gerar migração vazia**

  ```bash
  bun run db:migrations-gen-empty
  ```

  Cria um arquivo de migração vazio, útil para casos em que é necessário escrever a migração manualmente.

- **Aplicar migrações pendentes**

  ```bash
  bun run db:migrate
  ```

  Executa todas as migrações pendentes no banco de dados.

- **Sincronizar schema sem gerar migrações**

  ```bash
  bun run db:push
  ```

  Aplica diretamente as alterações do schema no banco, sem criar arquivos de migração (não recomendado).

### Geração de clientes de API com Orval

Você deve rodar o seguinte comando sempre que houver alterações na API (ou seja, mudanças no backend que afetam os endpoints documentados):

```bash
cd orval
bun run generate
```

### Build do projeto

### Executar em modo produção

### Testagem do TypeScript

Antes de abrir um Pull Request, certifique-se de que todos os testes estão passando tanto no frontend quanto no backend. Isso garante que suas alterações não quebrem funcionalidades existentes.

```bash
cd frontend
bun run test
```

```bash
cd backend
bun run test
```

### Lint e format

Antes de enviar um Pull Request, verifique se o código está limpo e bem formatado. Isso ajuda a manter a padronização e evita erros de estilo.

Verificar e corrigir problemas de lint:

```bash
cd backend
bun run lint
```

```bash
cd frontend
bun run lint
```

Formatação de código

```bash
cd backend
bun run format
```

```bash
cd frontend
bun run format
```
