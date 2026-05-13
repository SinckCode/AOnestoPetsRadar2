# Guía para Crear Video de Demostración

Esta guía te ayudará a grabar un video mostrando todos los requisitos del examen parcial.

## Contenido del Video (Requisitos)

El video debe incluir:

1. ✅ **Commit en Git** (inicio del video)
2. ✅ **Compilación de la aplicación**
3. ✅ **Endpoints GET con caché Redis**
4. ✅ **Búsqueda automática por radio (500m)**
5. ✅ **Construcción de imagen Docker**
6. ✅ **Push a GitHub Container Registry (GHCR)**

---

## Pasos a grabar

### 1️⃣ **Hacer un nuevo commit** (Inicio del video)

```bash
# Mostrar los cambios
git status

# Hacer commit
git commit -am "feat: Demostración de Pet Radar API - Examen Parcial II"

# Mostrar el commit
git log -1 --oneline

# Hacer push
git push origin main
```

### 2️⃣ **Compilar la aplicación**

```bash
# Limpiar y compilar
npm run build

# Mostrar que compiló sin errores
echo "✅ Compilación exitosa"
```

### 3️⃣ **Iniciar servicios Docker**

```bash
# Iniciar PostgreSQL + Redis
docker-compose up -d

# Esperar 10 segundos a que se inicien
sleep 10

# Verificar que están corriendo
docker ps
```

### 4️⃣ **Ejecutar la API en desarrollo**

```bash
# En una terminal separada
npm run start:dev

# Esperar a que se inicie (10-15 segundos)
# Debería mostrar: "Nest application successfully started"
```

### 5️⃣ **Probar GET /api/lost-pets (caché Redis)**

```bash
# Primera llamada (desde BD)
curl -X GET http://localhost:3000/api/lost-pets \
  -H "Content-Type: application/json" | jq .

# Segunda llamada (desde caché Redis)
curl -X GET http://localhost:3000/api/lost-pets \
  -H "Content-Type: application/json" | jq .

# Mostrar que es la misma respuesta (cacheada)
echo "✅ Respuesta cacheada en Redis por 60 segundos"
```

### 6️⃣ **Probar GET /api/found-pets (caché Redis)**

```bash
curl -X GET http://localhost:3000/api/found-pets \
  -H "Content-Type: application/json" | jq .

echo "✅ GET /found-pets también está cacheado en Redis"
```

### 7️⃣ **Demostrar búsqueda por radio (500m)**

**Primero, crear una mascota perdida:**

```bash
curl -X POST http://localhost:3000/api/lost-pets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max",
    "species": "Perro",
    "breed": "Golden Retriever",
    "color": "Dorado",
    "size": "Grande",
    "description": "Perro desaparecido en el parque central",
    "photo_url": "https://example.com/max.jpg",
    "owner_name": "Juan García",
    "owner_email": "juan@example.com",
    "owner_phone": "+34612345678",
    "address": "Parque Central, Calle Principal 123",
    "lost_date": "2026-05-12T10:00:00Z",
    "lat": 10.3932,
    "lon": -75.5389
  }' | jq .
```

**Luego, crear una mascota encontrada CERCA (dentro de 500m):**

```bash
curl -X POST http://localhost:3000/api/found-pets \
  -H "Content-Type: application/json" \
  -d '{
    "species": "Perro",
    "breed": "Golden Retriever",
    "color": "Dorado",
    "size": "Grande",
    "description": "Perro encontrado asustado en la avenida",
    "photo_url": "https://example.com/found_dog.jpg",
    "finder_name": "María López",
    "finder_email": "maria@example.com",
    "finder_phone": "+34645678901",
    "address": "Avenida Central 500",
    "found_date": "2026-05-12T15:30:00Z",
    "lat": 10.3945,
    "lon": -75.5395
  }' | jq .
```

**RESULTADO ESPERADO EN EL VIDEO:**
- El array `nearbyLostPets` debería contener a "Max"
- Se muestra la `distance` en metros (debería ser ~600-800m)
- Se ordena por distancia ascendente

### 8️⃣ **Verificar Redis cache**

```bash
# Conectarse a Redis
docker exec -it PetRadarRedis redis-cli

# Ver las claves cacheadas
> KEYS *

# Ver contenido de una clave
> GET "lost-pets"

# Ver TTL restante
> TTL "lost-pets"

# Salir
> EXIT
```

### 9️⃣ **Construir imagen Docker**

```bash
# Construir la imagen
docker build -t animalitos-lost-api:demo .

# Mostrar que se construyó
docker images | grep animalitos-lost-api

echo "✅ Imagen Docker construida exitosamente"
```

### 🔟 **Push a GitHub Container Registry (GHCR)**

```bash
# Ver el workflow en GitHub
echo "GitHub Actions workflow disparado en cada push a main"
echo "URL: https://github.com/SinckCode/AOnestoPetsRadar/actions"

# Ver la imagen en GHCR
echo "Imagen disponible en: ghcr.io/sinckcode/aonestopetsradar:latest"
echo "Package URL: https://github.com/SinckCode/AOnestoPetsRadar/pkgs/container/aonestopetsradar"
```

---

## Estructura recomendada del video

```
[0:00 - 0:15]   - Intro: "Pet Radar API - Examen Parcial II"
[0:15 - 0:45]   - Git commit y push
[0:45 - 1:15]   - Compilación (npm run build)
[1:15 - 1:45]   - docker-compose up -d
[1:45 - 2:15]   - npm run start:dev (esperar a que inicie)
[2:15 - 2:45]   - GET /api/lost-pets (primera llamada + segunda cacheada)
[2:45 - 3:15]   - GET /api/found-pets (cacheado)
[3:15 - 4:30]   - Demostración de búsqueda por radio
                   • Crear mascota perdida
                   • Crear mascota encontrada cercana
                   • Mostrar nearbyLostPets con distancia
[4:30 - 5:00]   - Verificar Redis cache
[5:00 - 5:30]   - docker build (construir imagen)
[5:30 - 6:00]   - Mostrar workflow de GitHub Actions
[6:00 - 6:30]   - Mostrar imagen en GHCR
[6:30 - 6:45]   - Conclusión
```

**Duración total recomendada: 6-8 minutos**

---

## Requisitos visibles en el video

✅ **1. Redis Caché**
   - Mostrar GET /lost-pets (2 veces, segunda es cacheada)
   - Mostrar GET /found-pets (cacheada)
   - Verificar en Redis CLI que están cacheados

✅ **2. Application Insights**
   - Mostrar variable APPINSIGHTS_INSTRUMENTATIONKEY en .env
   - Mencionarla brevemente en la presentación

✅ **3. Docker**
   - Ejecutar: `docker build -t animalitos-lost-api:demo .`
   - Mostrar la imagen creada: `docker images`

✅ **4. GitHub Actions + GHCR**
   - Mostrar el commit (trigger del workflow)
   - Ir a GitHub Actions
   - Mostrar la imagen en GHCR

✅ **5. Búsqueda por radio**
   - Crear mascota perdida en ubicación (lon, lat)
   - Crear mascota encontrada cerca (500m)
   - Mostrar response con `nearbyLostPets`
   - Demostrar que encuentra la mascota dentro de 500m

---

## Herramientas recomendadas para grabar

- **OBS Studio** (gratuito) - https://obsproject.com/
- **Camtasia** (pago pero fácil de usar)
- **ScreenFlow** (Mac)
- **Built-in Screen Recorder** (Windows 11: Windows Key + Shift + S)

---

## Tips para un buen video

1. 🎯 **Habla claro** - Explica qué estás demostrando
2. 📹 **Zoom en la terminal** - Aumenta el tamaño de fuente
3. 🎨 **Resalta lo importante** - El búsqueda por radio es el star del show
4. ⏱️ **Mantén ritmo** - No dejes que cargue mucho en pantalla
5. 📊 **Muestra resultados** - Los arrays de JSON deben ser legibles

---

## Ejemplo de comando completo para video

Aquí está el script completo que podrías ejecutar de principio a fin:

```bash
#!/bin/bash

# 1. Git
git commit -am "feat: Demostración Pet Radar API"
git push origin main
git log -1

# 2. Compilar
npm run build

# 3. Docker services
docker-compose up -d
sleep 10
docker ps

# 4. API en dev
npm run start:dev &
sleep 15

# 5. GET endpoints (con caché)
echo "=== GET /api/lost-pets (primera llamada) ==="
curl -X GET http://localhost:3000/api/lost-pets | jq .

sleep 2

echo "=== GET /api/lost-pets (cacheada) ==="
curl -X GET http://localhost:3000/api/lost-pets | jq .

# 6. POST lost-pets
echo "=== Creando mascota perdida ==="
curl -X POST http://localhost:3000/api/lost-pets \
  -H "Content-Type: application/json" \
  -d '{"name":"Max","species":"Perro",...}' | jq .

# 7. POST found-pets (búsqueda por radio)
echo "=== Creando mascota encontrada (búsqueda por radio) ==="
curl -X POST http://localhost:3000/api/found-pets \
  -H "Content-Type: application/json" \
  -d '{"species":"Perro",...}' | jq .

# 8. Docker build
docker build -t animalitos-lost-api:demo .
docker images | grep animalitos

# 9. Show GHCR
echo "Image en: ghcr.io/sinckcode/aonestopetsradar:latest"
```

---

¡Listo para grabar! 🎬
