# Configuración de Azure Application Insights

## Pasos para activar Application Insights en el proyecto

### 1. Obtener la Instrumentation Key

La instrumentation key proporcionada para testing es:
```
09aef441-a89a-40ef-a65e-f2fdd612ceca
```

### 2. Configurar en `.env`

Abre el archivo `.env` en la raíz del proyecto y actualiza:

```env
APPINSIGHTS_INSTRUMENTATIONKEY="09aef441-a89a-40ef-a65e-f2fdd612ceca"
```

### 3. Reiniciar la aplicación

```bash
npm run start:dev
```

### 4. Verificar la integración

Una vez iniciada la aplicación con la instrumentation key configurada:

- Los eventos se enviarán automáticamente a Azure Application Insights
- Puedes ver los datos en Azure Portal
- Se registrarán:
  - Solicitudes HTTP
  - Excepciones
  - Métricas de rendimiento
  - Eventos personalizados

### 5. Acceder a los datos en Azure Portal

1. Ve a https://portal.azure.com
2. Busca tu Application Insights resource
3. En el panel principal verás:
   - **Live metrics**: métricas en tiempo real
   - **Failures**: errores y excepciones
   - **Performance**: tiempos de respuesta
   - **Overview**: resumen general

## Notas de seguridad

⚠️ **IMPORTANTE**: 
- El archivo `.env` está en `.gitignore` - no se pushea a Git
- La instrumentation key es sensible pero no es tan crítica como otras credenciales
- En producción, usa variables de entorno seguras (secrets de GitHub, Azure Key Vault, etc.)

## Verificación de Application Insights activo

Si todo está configurado correctamente, en el terminal deberías ver algo como:

```
Application Insights started successfully
```

Y en Azure Portal verás eventos llegando en tiempo real.

## Solución de problemas

Si no ves datos en Application Insights:

1. Verifica que la key esté correcta en `.env`
2. Reinicia la aplicación después de cambiar `.env`
3. Espera 1-2 minutos para que los datos aparezcan en el portal
4. Revisa la consola del navegador para errores de conectividad

## Endpoints que generan telemetría

Cualquier request a los endpoints generará telemetría:

- `GET /api/lost-pets` - búsqueda de mascotas perdidas
- `GET /api/found-pets` - búsqueda de mascotas encontradas
- `POST /api/lost-pets` - crear mascota perdida
- `POST /api/found-pets` - crear mascota encontrada

Todos estos eventos serán registrados en Application Insights.
