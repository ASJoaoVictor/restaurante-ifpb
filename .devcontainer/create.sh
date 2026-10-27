#!/bin/bash

# Inicia o PostgreSQL
sudo service postgresql start

# Cria o banco de dados
psql -c 'CREATE DATABASE "meals"'

# Deixa as portas públicas
gh codespace ports visibility 3000:public -c $CODESPACE_NAME
gh codespace ports visibility 5173:public -c $CODESPACE_NAME
gh codespace ports visibility 4173:public -c $CODESPACE_NAME

# Instala as bibliotecas do back-end
cd backend
bun install
bun run db:migrate
bun run db:seed
cd ..

# Instala as bibliotecas do front-end
cd frontend
bun install
cd ..

# Instala as bibliotecas do orval
cd orval
bun install
cd ..

# Cria o .env para o Docker
touch .env
