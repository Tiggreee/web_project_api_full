#!/bin/bash

# Script de comandos útiles para el servidor
# Guarda este archivo y ejecútalo con: source server-commands.sh

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Comandos útiles para el servidor${NC}"
echo ""

# Funciones útiles

# Ver estado de todos los servicios
status() {
    echo -e "${YELLOW}📊 Estado de servicios:${NC}"
    echo "=== MongoDB ==="
    sudo systemctl status mongod --no-pager | grep Active
    echo ""
    echo "=== nginx ==="
    sudo systemctl status nginx --no-pager | grep Active
    echo ""
    echo "=== PM2 ==="
    pm2 status
}

# Ver logs en tiempo real
logs() {
    echo -e "${YELLOW}📝 Logs de la aplicación:${NC}"
    pm2 logs around-api
}

# Reiniciar todo
restart-all() {
    echo -e "${YELLOW}🔄 Reiniciando servicios...${NC}"
    pm2 restart around-api
    sudo systemctl restart nginx
    echo -e "${GREEN}✅ Servicios reiniciados${NC}"
}

# Actualizar código desde Git
update() {
    echo -e "${YELLOW}📥 Actualizando código desde Git...${NC}"
    cd ~/web_project_api_full
    git pull origin main
    
    echo -e "${YELLOW}📦 Instalando dependencias backend...${NC}"
    cd backend
    npm install --production
    
    echo -e "${YELLOW}🔄 Reiniciando aplicación...${NC}"
    pm2 restart around-api
    
    echo -e "${GREEN}✅ Actualización completada${NC}"
}

# Backup de base de datos
backup() {
    echo -e "${YELLOW}💾 Creando backup de MongoDB...${NC}"
    DATE=$(date +%Y%m%d_%H%M%S)
    mkdir -p ~/backups
    mongodump --db aroundb --out ~/backups/backup_$DATE
    echo -e "${GREEN}✅ Backup creado en ~/backups/backup_$DATE${NC}"
}

# Ver uso de recursos
resources() {
    echo -e "${YELLOW}💻 Uso de recursos:${NC}"
    echo "=== CPU y Memoria ==="
    top -bn1 | head -5
    echo ""
    echo "=== Disco ==="
    df -h | grep -E '^/dev/'
    echo ""
    echo "=== Procesos Node ==="
    ps aux | grep node | grep -v grep
}

# Probar API
test-api() {
    echo -e "${YELLOW}🧪 Probando API...${NC}"
    echo "=== Test local (puerto 3000) ==="
    curl -s http://localhost:3000/ || echo "❌ API no responde en localhost:3000"
    echo ""
    echo "=== Test crash-test ==="
    curl -s http://localhost:3000/crash-test && echo "✅ Crash test ejecutado"
    sleep 2
    echo "=== Verificando auto-recuperación ==="
    pm2 status
}

# Ver certificados SSL
ssl-info() {
    echo -e "${YELLOW}🔒 Información de certificados SSL:${NC}"
    sudo certbot certificates
}

# Renovar certificado SSL
renew-ssl() {
    echo -e "${YELLOW}🔄 Renovando certificado SSL...${NC}"
    sudo certbot renew
    sudo systemctl reload nginx
    echo -e "${GREEN}✅ Certificado renovado${NC}"
}

# Limpiar logs viejos
clean-logs() {
    echo -e "${YELLOW}🧹 Limpiando logs antiguos...${NC}"
    cd ~/web_project_api_full/backend
    > request.log
    > error.log
    pm2 flush
    echo -e "${GREEN}✅ Logs limpiados${NC}"
}

# Menú de ayuda
help-menu() {
    echo -e "${GREEN}Comandos disponibles:${NC}"
    echo "  status        - Ver estado de servicios"
    echo "  logs          - Ver logs en tiempo real"
    echo "  restart-all   - Reiniciar todos los servicios"
    echo "  update        - Actualizar código desde Git y reiniciar"
    echo "  backup        - Crear backup de MongoDB"
    echo "  resources     - Ver uso de CPU, memoria y disco"
    echo "  test-api      - Probar que la API funcione"
    echo "  ssl-info      - Ver información de certificados SSL"
    echo "  renew-ssl     - Renovar certificado SSL"
    echo "  clean-logs    - Limpiar logs antiguos"
    echo "  help-menu     - Mostrar esta ayuda"
}

# Mostrar ayuda al cargar
help-menu
