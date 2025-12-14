## Checklist de Despliegue

Usa esta lista para verificar que completaste todos los pasos antes de enviar tu proyecto.

### Backend (Parte I - Completada ✅)

- [x] 1. Email y password añadidos al esquema de usuario
- [x] 2. Controlador createUser actualizado (hash, campos opcionales)
- [x] 3. Controlador login creado (JWT 7 días)
- [x] 4. Rutas /signin y /signup creadas
- [x] 5. Middleware de autorización creado
- [x] 6. Ruta GET /users/me implementada
- [x] 7. Rutas protegidas con autorización
- [x] 8. Middleware hardcoded eliminado
- [x] 9. Verificación de derechos de usuario
- [x] 10. Campo password con select: false
- [x] 11. Frontend configurado con localStorage y JWT

### Backend (Parte II)

- [x] 1. Manejo centralizado de errores implementado
- [x] 2. Validación de solicitudes con Celebrate
- [x] 3. Logging con Winston (request.log y error.log)
- [x] 4. Backend y Frontend en carpetas separadas
- [ ] 5. Servidor en la nube creado
- [ ] 6. Aplicación desplegada y funcional
- [ ] 7. Archivo .env creado en el servidor
- [ ] 8. Dominio registrado y nginx configurado
- [ ] 9. Certificados SSL instalados (HTTPS)
- [x] 10. Endpoint /crash-test implementado
- [ ] 11. Dominio añadido al README.md

### Pasos de Despliegue (Pendientes)

#### 1. Crear Servidor
- [ ] Servidor creado en Google Cloud/AWS/DigitalOcean
- [ ] IP pública obtenida
- [ ] Acceso SSH configurado

#### 2. Instalar Software en Servidor
- [ ] Node.js instalado (v18+)
- [ ] MongoDB instalado y corriendo
- [ ] nginx instalado
- [ ] PM2 instalado globalmente

#### 3. Subir Código
- [ ] Frontend build creado (`npm run build`)
- [ ] Código subido al servidor (Git o scp)
- [ ] Dependencias instaladas en servidor

#### 4. Configurar Backend
- [ ] Archivo .env creado con NODE_ENV=production
- [ ] JWT_SECRET seguro generado
- [ ] MongoDB conectado
- [ ] PM2 iniciado con ecosystem.config.js
- [ ] PM2 configurado para auto-inicio

#### 5. Configurar Dominio
- [ ] Dominio registrado (FreeDNS o pagado)
- [ ] DNS apuntando a IP del servidor
- [ ] Propagación DNS verificada

#### 6. Configurar nginx
- [ ] Archivo de configuración creado en /etc/nginx/sites-available/
- [ ] Enlace simbólico creado en sites-enabled/
- [ ] Configuración probada (`nginx -t`)
- [ ] nginx reiniciado

#### 7. SSL/HTTPS
- [ ] Certbot instalado
- [ ] Certificado SSL obtenido
- [ ] HTTPS funcionando
- [ ] Renovación automática configurada

#### 8. Actualizar Frontend
- [ ] URL de API actualizada en config.js
- [ ] Frontend reconstruido
- [ ] Nuevo build subido al servidor

#### 9. Actualizar Backend (CORS)
- [ ] CORS configurado con dominio correcto
- [ ] Backend reiniciado con PM2

#### 10. Pruebas Finales
- [ ] Frontend accesible vía HTTPS
- [ ] API responde correctamente
- [ ] Registro de usuarios funciona
- [ ] Login funciona
- [ ] Crear tarjetas funciona
- [ ] Eliminar tarjetas funciona
- [ ] Likes funcionan
- [ ] Editar perfil funciona
- [ ] Crash test funciona y PM2 recupera

#### 11. Documentación
- [ ] README.md actualizado con dominio
- [ ] Commit y push al repositorio
- [ ] Proyecto listo para revisión

---

## Comandos Rápidos de Verificación

### En el servidor:
```bash
# Estado de servicios
sudo systemctl status mongod
sudo systemctl status nginx
pm2 status

# Ver logs
pm2 logs
tail -f ~/web_project_api_full/backend/error.log

# Probar API localmente
curl http://localhost:3000/
```

### Desde tu máquina:
```bash
# Probar frontend
curl https://tu-dominio.com

# Probar API
curl https://tu-dominio.com/api/

# Probar crash test
curl https://tu-dominio.com/api/crash-test
```

## Problemas Comunes

### La API no responde
1. Verificar que PM2 esté corriendo: `pm2 status`
2. Ver logs: `pm2 logs around-api`
3. Verificar MongoDB: `sudo systemctl status mongod`

### Frontend no carga
1. Verificar nginx: `sudo nginx -t`
2. Ver logs de nginx: `sudo tail -f /var/log/nginx/error.log`
3. Verificar que dist/ tenga archivos

### Certificado SSL no funciona
1. Verificar dominio DNS: `nslookup tu-dominio.com`
2. Regenerar certificado: `sudo certbot --nginx -d tu-dominio.com`
3. Ver status: `sudo certbot certificates`

---

**Fecha de última actualización:** [Añade fecha cuando completes el despliegue]
