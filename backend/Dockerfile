FROM imbios/bun-node:22-slim

WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=5120"

RUN apt-get update \
  && apt-get install -y wget \
  && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copia somente os arquivos necessários para o build
COPY tsconfig.* nest-cli.json ./
COPY src ./src
RUN bun run build

COPY drizzle.config.ts ./
COPY public ./public

CMD ["bun", "run", "start"]
