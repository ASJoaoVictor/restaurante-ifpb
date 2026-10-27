#!/bin/bash

# Inicia o PostgreSQL
sudo service postgresql start

# Deixa as portas públicas
gh codespace ports visibility 3000:public -c $CODESPACE_NAME
gh codespace ports visibility 5173:public -c $CODESPACE_NAME
gh codespace ports visibility 4173:public -c $CODESPACE_NAME
