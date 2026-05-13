# Pet Radar API - Examen Parcial II

Sistema de búsqueda geo-referenciada de mascotas perdidas y encontradas usando NestJS, PostGIS y Redis.

## Características

- **Búsqueda por Radio**: Encuentra mascotas perdidas activas dentro de 500 metros usando PostGIS
- **Caché Redis**: Endpoints GET cacheados con TTL de 60 segundos
- **Monitoreo**: Integración con Azure Application Insights
- **Containerización**: Dockerfile multi-stage optimizado para producción
- **CI/CD**: GitHub Actions para build automático y push a GitHub Container Registry (GHCR)

## Requisitos

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16+ con PostGIS
- Redis 7+

## Configuración del Proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

### 3. Iniciar servicios (PostgreSQL + Redis)

```bash
docker-compose up -d
```

### 4. Ejecutar migraciones (si es necesario)

```bash
npm run migration:run
```

## Ejecutar la aplicación

```bash
# Desarrollo
npm run start:dev

# Producción (compilar primero)
npm run build
npm run start:prod
```

La API estará disponible en `http://localhost:3000/api`

## Endpoints de la API

### Mascotas Perdidas

- **GET** `/api/lost-pets` - Listado de mascotas perdidas activas (cacheado en Redis por 60s)
- **POST** `/api/lost-pets` - Crear una mascota perdida

### Mascotas Encontradas

- **GET** `/api/found-pets` - Listado de mascotas encontradas (cacheado en Redis por 60s)
- **POST** `/api/found-pets` - Crear una mascota encontrada + búsqueda automática de coincidencias por radio

### Búsqueda por Radio

Cuando se reporta una mascota encontrada (`POST /api/found-pets`), el sistema:
1. Almacena la mascota encontrada en la BD
2. Busca automáticamente mascotas perdidas activas en un radio de 500 metros
3. Usa PostGIS ST_DWithin con distancia en metros (::geography)
4. Retorna las coincidencias ordenadas por distancia

## Ejecutar pruebas

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Docker

### Construir imagen Docker

```bash
docker build -t animalitos-lost-api:latest .
```

### Ejecutar contenedor

```bash
docker run -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e REDIS_URL=redis://host.docker.internal:6379 \
  animalitos-lost-api:latest
```

## Integración Continua (GitHub Actions)

El repositorio incluye un workflow automático (`.github/workflows/docker-publish.yml`) que:

1. Se dispara en cada push a `main`
2. Construye la imagen Docker
3. Publica automáticamente en GitHub Container Registry (GHCR) en: `ghcr.io/sinckcode/aonestopetsradar`

Para ver las imágenes construidas:
```bash
docker login ghcr.io
docker pull ghcr.io/sinckcode/aonestopetsradar:latest
```

## Stack Tecnológico

- **Framework**: NestJS 11+
- **ORM**: TypeORM 0.3+
- **Base de Datos**: PostgreSQL 16+ con PostGIS
- **Caché**: Redis 7+ con @nestjs/cache-manager
- **Monitoreo**: Azure Application Insights
- **Containerización**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

## Examen Parcial II - Requisitos Completados

✅ 1. Implementación de Redis (caché en endpoints GET)
- GET `/lost-pets` con caché Redis (TTL 60s)
- GET `/found-pets` con caché Redis (TTL 60s)

✅ 2. Implementación de Application Insights
- Integración de Azure Application Insights para monitoreo y telemetría

✅ 3. Contenerización con Docker
- Dockerfile multi-stage para compilación y ejecución optimizada

✅ 4. GitHub Actions (build y push a GHCR)
- Workflow automático de CI/CD con publicación en GitHub Container Registry

✅ 5. Búsqueda por Radio (funcionalidad central)
- Búsqueda automática de mascotas perdidas activas dentro de 500m
- Uso de ST_DWithin de PostGIS con cast a ::geography para distancias en metros
