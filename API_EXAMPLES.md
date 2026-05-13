# Pet Radar API - Ejemplos de Pruebas

## Requisitos previos

Asegúrate de tener los servicios ejecutando:
```bash
docker-compose up -d
npm run start:dev
```

La API estará disponible en `http://localhost:3000/api`

## Endpoints disponibles

### 1. GET /api/lost-pets (con caché Redis)

Obtiene todas las mascotas perdidas activas. Esta respuesta está cacheada en Redis por 60 segundos.

**Request:**
```bash
curl -X GET http://localhost:3000/api/lost-pets \
  -H "Content-Type: application/json"
```

**Response (ejemplo):**
```json
[
  {
    "id": 1,
    "name": "Max",
    "species": "Perro",
    "breed": "Golden Retriever",
    "color": "Dorado",
    "size": "Grande",
    "description": "Perro dorado desaparecido en el parque",
    "photo_url": "https://example.com/max.jpg",
    "owner_name": "Juan",
    "owner_email": "juan@example.com",
    "owner_phone": "+34612345678",
    "location": {
      "type": "Point",
      "coordinates": [-75.5389, 10.3932]
    },
    "address": "Calle Principal 123",
    "lost_date": "2026-05-10T00:00:00.000Z",
    "is_active": true,
    "created_at": "2026-05-10T10:30:00.000Z",
    "updated_at": "2026-05-10T10:30:00.000Z"
  }
]
```

### 2. GET /api/found-pets (con caché Redis)

Obtiene todas las mascotas encontradas. Esta respuesta está cacheada en Redis por 60 segundos.

**Request:**
```bash
curl -X GET http://localhost:3000/api/found-pets \
  -H "Content-Type: application/json"
```

**Response (ejemplo):**
```json
[
  {
    "id": 1,
    "species": "Gato",
    "breed": "Persa",
    "color": "Blanco y gris",
    "size": "Pequeño",
    "description": "Gato encontrado en la avenida central",
    "photo_url": "https://example.com/cat.jpg",
    "finder_name": "María",
    "finder_email": "maria@example.com",
    "finder_phone": "+34687654321",
    "location": {
      "type": "Point",
      "coordinates": [-75.5400, 10.3940]
    },
    "address": "Avenida Central 456",
    "found_date": "2026-05-12T00:00:00.000Z",
    "created_at": "2026-05-12T14:20:00.000Z",
    "updated_at": "2026-05-12T14:20:00.000Z"
  }
]
```

### 3. POST /api/lost-pets

Crea un registro de mascota perdida.

**Request:**
```bash
curl -X POST http://localhost:3000/api/lost-pets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fluffy",
    "species": "Gato",
    "breed": "Siamés",
    "color": "Café y blanco",
    "size": "Pequeño",
    "description": "Gato Siamés desaparecido hace 3 días",
    "photo_url": "https://example.com/fluffy.jpg",
    "owner_name": "Carlos",
    "owner_email": "carlos@example.com",
    "owner_phone": "+34623456789",
    "address": "Calle Las Flores 789",
    "lost_date": "2026-05-10T12:00:00Z",
    "lat": 10.3932,
    "lon": -75.5389
  }'
```

### 4. POST /api/found-pets (con búsqueda por radio automática)

Crea un registro de mascota encontrada y **automáticamente busca mascotas perdidas activas en un radio de 500 metros**.

**Request:**
```bash
curl -X POST http://localhost:3000/api/found-pets \
  -H "Content-Type: application/json" \
  -d '{
    "species": "Gato",
    "breed": "Siamés",
    "color": "Café y blanco",
    "size": "Pequeño",
    "description": "Gato encontrado asustado en la calle",
    "photo_url": "https://example.com/found_cat.jpg",
    "finder_name": "Ana",
    "finder_email": "ana@example.com",
    "finder_phone": "+34645678901",
    "address": "Avenida Central 500",
    "found_date": "2026-05-12T15:30:00Z",
    "lat": 10.3945,
    "lon": -75.5390
  }'
```

**Response (ejemplo):**
```json
{
  "message": "Se creo una mascota encontrada",
  "foundPet": {
    "id": 2,
    "species": "Gato",
    "breed": "Siamés",
    "color": "Café y blanco",
    "size": "Pequeño",
    "description": "Gato encontrado asustado en la calle",
    "photo_url": "https://example.com/found_cat.jpg",
    "finder_name": "Ana",
    "finder_email": "ana@example.com",
    "finder_phone": "+34645678901",
    "location": {
      "type": "Point",
      "coordinates": [-75.5390, 10.3945]
    },
    "address": "Avenida Central 500",
    "found_date": "2026-05-12T15:30:00Z",
    "created_at": "2026-05-12T15:35:00.000Z",
    "updated_at": "2026-05-12T15:35:00.000Z"
  },
  "emailSent": true,
  "nearbyLostPets": [
    {
      "id": 1,
      "name": "Fluffy",
      "species": "Gato",
      "breed": "Siamés",
      "color": "Café y blanco",
      "size": "Pequeño",
      "description": "Gato Siamés desaparecido hace 3 días",
      "photo_url": "https://example.com/fluffy.jpg",
      "owner_name": "Carlos",
      "owner_email": "carlos@example.com",
      "owner_phone": "+34623456789",
      "location": {
        "type": "Point",
        "coordinates": [-75.5389, 10.3932]
      },
      "address": "Calle Las Flores 789",
      "lost_date": "2026-05-10T12:00:00Z",
      "is_active": true,
      "distance": 167.45
    }
  ]
}
```

## Verificación del Caché Redis

Las respuestas de `GET /api/lost-pets` y `GET /api/found-pets` están almacenadas en Redis.

Puedes verificar el caché conectándote a Redis:

```bash
# Entrar al CLI de Redis
docker exec -it PetRadarRedis redis-cli

# Ver todas las claves en caché
> KEYS *

# Ver un caché específico (ejemplo para lost-pets)
> GET "lost-pets"
```

El TTL (Time To Live) está configurado a 60 segundos, así que después de eso se realizará una nueva consulta a la base de datos.

## Información importante

- **Búsqueda por radio**: Solo funciona cuando se crea una mascota ENCONTRADA (`POST /found-pets`)
- **Mascotas activas**: Solo se retornan mascotas perdidas con `is_active = true`
- **Distancia**: Se calcula en metros usando PostGIS con cast a `::geography`
- **Radio de búsqueda**: 500 metros
- **Caché**: 60 segundos en Redis

## Docker Container Registry (GHCR)

La imagen Docker se construye automáticamente en cada push a `main`:

```bash
# Descargar la imagen
docker login ghcr.io
docker pull ghcr.io/sinckcode/aonestopetsradar:latest

# Ejecutar el contenedor
docker run -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e REDIS_URL=redis://host.docker.internal:6379 \
  ghcr.io/sinckcode/aonestopetsradar:latest
```

## Monitoreo con Application Insights

Si configuraste `APPINSIGHTS_INSTRUMENTATIONKEY` en `.env`, los eventos se enviarán a Azure Application Insights para monitoreo y telemetría.
