// Configuración de API para diferentes entornos

const config = {
  development: {
    baseUrl: 'http://localhost:3000',
  },
  production: {
    // IMPORTANTE: Actualiza esta URL con tu dominio real después del despliegue
    baseUrl: 'https://tu-dominio.com/api',
    // O si usas un subdominio para la API:
    // baseUrl: 'https://api.tu-dominio.com',
  },
};

// Detectar entorno actual
const environment = import.meta.env.MODE || 'development';

export default config[environment];
