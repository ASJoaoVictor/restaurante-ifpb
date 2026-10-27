FROM imbios/bun-node:22-slim AS builder

WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=5120"

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# O uso de ARG permite rebuildar quando a variável muda
ARG VITE_API_ENDPOINT
ARG VITE_REPORT_EMAIL
ARG GOOGLE_CLIENT_ID
ENV VITE_API_ENDPOINT=$VITE_API_ENDPOINT
ENV VITE_REPORT_EMAIL=$VITE_REPORT_EMAIL
ENV VITE_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID

# Copia somente os arquivos necessários para o build
COPY index.html tsconfig.* vite.config.* ./
COPY src ./src
COPY public ./public

RUN bun run build

FROM nginx:alpine

# Exclui os arquivos padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
