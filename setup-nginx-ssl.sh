#!/bin/bash
# Script para configurar nginx y SSL en el servidor
# Ejecutar como root o con sudo

set -e

echo "🚀 Configurando tigre-around.duckdns.org..."

# 1. Crear configuración de nginx
echo "📝 Creando configuración de nginx..."
cat > /etc/nginx/sites-available/tigre-around << 'EOF'
server {
    listen 80;
    server_name tigre-around.duckdns.org;

    # Frontend - servir archivos estáticos
    location / {
        root /home/victor/web_project_api_full/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 2. Activar sitio
echo "🔗 Activando sitio..."
ln -sf /etc/nginx/sites-available/tigre-around /etc/nginx/sites-enabled/

# 3. Eliminar default si existe
rm -f /etc/nginx/sites-enabled/default

# 4. Probar configuración
echo "🧪 Probando configuración de nginx..."
nginx -t

# 5. Reiniciar nginx
echo "🔄 Reiniciando nginx..."
systemctl restart nginx

# 6. Instalar certbot si no está
echo "🔒 Instalando certbot para SSL..."
apt-get update
apt-get install -y certbot python3-certbot-nginx

# 7. Obtener certificado SSL
echo "📜 Obteniendo certificado SSL..."
certbot --nginx -d tigre-around.duckdns.org --non-interactive --agree-tos --email notlikeiusedto@gmail.com --redirect

# 8. Verificar renovación automática
echo "⏰ Verificando renovación automática..."
certbot renew --dry-run

echo "✅ ¡Configuración completada!"
echo ""
echo "Tu sitio está disponible en:"
echo "  🌐 https://tigre-around.duckdns.org"
echo "  🔌 API: https://tigre-around.duckdns.org/api"
echo ""
echo "Verifica que todo funcione:"
echo "  curl https://tigre-around.duckdns.org"
echo "  curl https://tigre-around.duckdns.org/api/"
