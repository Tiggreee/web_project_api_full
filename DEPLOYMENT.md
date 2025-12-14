# Guía de Despliegue - Around Full Stack

Esta guía te ayudará a desplegar tu aplicación full stack en un servidor en la nube.

## Requisitos Previos

- Servidor en la nube (Google Cloud, AWS, DigitalOcean, etc.)
- Dominio registrado (puedes usar FreeDNS gratuito)
- Acceso SSH al servidor

## Paso 1: Preparar el Servidor

### 1.1 Conectar al servidor por SSH

```bash
ssh tu-usuario@ip-del-servidor
```

### 1.2 Actualizar el sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Instalar Node.js (v18 o superior)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # Verificar instalación
npm -v
```

### 1.4 Instalar MongoDB

```bash
# Importar la clave pública de MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Crear archivo de lista para MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Actualizar e instalar
sudo apt update
sudo apt install -y mongodb-org

# Iniciar MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
```

### 1.5 Instalar nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 1.6 Instalar PM2 globalmente

```bash
sudo npm install -g pm2
```

## Paso 2: Subir el Código al Servidor

### 2.1 Desde tu máquina local, hacer build del frontend

```bash
cd frontend
npm run build
```

### 2.2 Crear directorio en el servidor

```bash
# En el servidor
mkdir -p ~/web_project_api_full
```

### 2.3 Copiar archivos con scp (desde tu máquina local)

```bash
# Copiar backend
scp -r backend tu-usuario@ip-servidor:~/web_project_api_full/

# Copiar frontend build
scp -r frontend/dist tu-usuario@ip-servidor:~/web_project_api_full/frontend/
```

O mejor aún, usa Git:

```bash
# En el servidor
cd ~
git clone https://github.com/tu-usuario/web_project_api_full.git
cd web_project_api_full/backend
npm install --production

cd ../frontend
npm install
npm run build
```

## Paso 3: Configurar Variables de Entorno

```bash
# En el servidor
cd ~/web_project_api_full/backend
nano .env
```

Añade:

```env
NODE_ENV=production
JWT_SECRET=tu-clave-secreta-super-segura-aqui-genera-una-larga
PORT=3000
```

**IMPORTANTE:** Genera un JWT_SECRET seguro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Paso 4: Iniciar la Aplicación con PM2

```bash
cd ~/web_project_api_full/backend

# Crear directorio para logs de PM2
mkdir -p logs

# Iniciar con PM2
pm2 start ecosystem.config.js

# Guardar la configuración de PM2
pm2 save

# Configurar PM2 para iniciar al arrancar el sistema
pm2 startup
# Ejecuta el comando que PM2 te muestre

# Verificar que está corriendo
pm2 status
pm2 logs around-api
```

## Paso 5: Configurar Dominio

### 5.1 Registrar dominio gratuito en FreeDNS

1. Ve a https://freedns.afraid.org/
2. Regístrate y crea un subdominio
3. Apunta el dominio a la IP pública de tu servidor

### 5.2 Esperar propagación DNS (5-30 minutos)

```bash
# Verificar propagación
nslookup tu-dominio.freedns.org
```

## Paso 6: Configurar nginx

### 6.1 Crear archivo de configuración

```bash
sudo nano /etc/nginx/sites-available/around
```

Usa el contenido del archivo `nginx.conf.example` (reemplaza `tu-dominio.com` con tu dominio real y `tu-usuario` con tu usuario del servidor).

### 6.2 Activar el sitio

```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/around /etc/nginx/sites-enabled/

# Eliminar configuración default si existe
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar nginx
sudo systemctl restart nginx
```

## Paso 7: Instalar Certificados SSL (HTTPS)

### 7.1 Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Obtener certificado

```bash
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

Sigue las instrucciones. Certbot configurará automáticamente nginx para HTTPS.

### 7.3 Verificar renovación automática

```bash
sudo certbot renew --dry-run
```

## Paso 8: Actualizar Frontend para usar la API correcta

Actualiza la URL de la API en tu frontend:

```javascript
// frontend/src/utils/api.js
const api = new Api({
  baseUrl: 'https://tu-dominio.com/api'  // o 'https://api.tu-dominio.com'
});
```

Reconstruye el frontend y súbelo:

```bash
# En tu máquina local
cd frontend
npm run build

# Subir al servidor
scp -r dist/* tu-usuario@ip-servidor:~/web_project_api_full/frontend/dist/
```

## Paso 9: Actualizar Backend para CORS

Verifica que el backend tenga CORS configurado para tu dominio:

```javascript
// backend/app.js
const corsOptions = {
  origin: ['https://tu-dominio.com', 'https://www.tu-dominio.com'],
  credentials: true
};
app.use(cors(corsOptions));
```

## Paso 10: Probar el Crash Test

```bash
# Desde tu navegador o con curl
curl https://tu-dominio.com/api/crash-test

# Verificar que PM2 reinicia automáticamente
pm2 status
pm2 logs
```

## Paso 11: Actualizar README

Añade tu dominio al README.md:

```markdown
## Dominio

- **Frontend:** https://tu-dominio.com
- **Backend API:** https://tu-dominio.com/api (o https://api.tu-dominio.com)
```

## Comandos Útiles

### PM2
```bash
pm2 list              # Ver aplicaciones
pm2 logs around-api   # Ver logs
pm2 restart around-api # Reiniciar
pm2 stop around-api   # Detener
pm2 delete around-api # Eliminar
pm2 monit             # Monitor en tiempo real
```

### nginx
```bash
sudo systemctl status nginx    # Estado
sudo systemctl restart nginx   # Reiniciar
sudo nginx -t                  # Probar configuración
sudo tail -f /var/log/nginx/error.log  # Ver errores
```

### MongoDB
```bash
sudo systemctl status mongod   # Estado
mongosh                        # Conectar a MongoDB
sudo systemctl restart mongod  # Reiniciar
```

### Ver logs de aplicación
```bash
cd ~/web_project_api_full/backend
tail -f request.log
tail -f error.log
pm2 logs
```

## Troubleshooting

### La API no responde
```bash
pm2 logs around-api
sudo systemctl status nginx
curl http://localhost:3000/users  # Probar localmente
```

### Error de MongoDB
```bash
sudo systemctl status mongod
sudo systemctl restart mongod
```

### Error de certificados SSL
```bash
sudo certbot certificates
sudo certbot renew
sudo systemctl restart nginx
```

### Ver puertos en uso
```bash
sudo netstat -tulpn | grep LISTEN
```

## Firewall (si usas UFW)

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status
```

## ¡Listo!

Tu aplicación debería estar funcionando en:
- **https://tu-dominio.com** (frontend)
- **https://tu-dominio.com/api** (backend)

Puedes probar todas las funcionalidades:
- ✅ Registro de usuarios
- ✅ Login
- ✅ Crear/editar/eliminar tarjetas
- ✅ Dar/quitar likes
- ✅ Editar perfil
- ✅ Crash test y auto-recuperación
