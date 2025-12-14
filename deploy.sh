#!/bin/bash

# Script de despliegue para Around Full Stack
# Uso: ./deploy.sh [usuario@servidor]

if [ -z "$1" ]; then
  echo "Uso: ./deploy.sh usuario@ip-servidor"
  exit 1
fi

SERVER=$1
PROJECT_DIR="web_project_api_full"

echo "🚀 Iniciando despliegue a $SERVER..."

# 1. Build del frontend
echo "📦 Construyendo frontend..."
cd frontend
npm run build
cd ..

# 2. Copiar archivos al servidor
echo "📤 Copiando archivos al servidor..."
ssh $SERVER "mkdir -p ~/$PROJECT_DIR"

# Copiar backend
echo "  - Copiando backend..."
scp -r backend $SERVER:~/$PROJECT_DIR/

# Copiar frontend build
echo "  - Copiando frontend..."
scp -r frontend/dist $SERVER:~/$PROJECT_DIR/frontend/

# Copiar archivos de configuración
echo "  - Copiando archivos de configuración..."
scp nginx.conf.example $SERVER:~/$PROJECT_DIR/
scp DEPLOYMENT.md $SERVER:~/$PROJECT_DIR/

# 3. Instalar dependencias en el servidor
echo "📥 Instalando dependencias en el servidor..."
ssh $SERVER "cd ~/$PROJECT_DIR/backend && npm install --production"

# 4. Reiniciar PM2
echo "🔄 Reiniciando aplicación con PM2..."
ssh $SERVER "cd ~/$PROJECT_DIR/backend && pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js"

echo "✅ Despliegue completado!"
echo ""
echo "Comandos útiles:"
echo "  ssh $SERVER 'pm2 logs'"
echo "  ssh $SERVER 'pm2 status'"
echo ""
