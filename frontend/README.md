# 🎮 Poke Guess Game - Docker Compose Setup

Juego de adivinanzas de Pokémon con arquitectura de microservicios basada en Docker Compose.

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                      NGINX (Puerto 8000)                │
│  Frontend SPA (Solid.js + Vite) | API Router            │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    ┌────────────┬────────────┬──────────────┐
    │   PHP 8.2  │  Postgres  │   Frontend   │
    │   FPM      │  DB Vol    │   SPA Build  │
    └────────────┴────────────┴──────────────┘
```

## 📋 Requisitos

- Docker & Docker Compose
- Node.js 18+ (para buildear frontend)
- npm o pnpm

## 🚀 Instalación Rápida

### Opción 1: Script automático

```bash
chmod +x setup.sh
./setup.sh
```

El script:
1. Instala dependencias del frontend
2. Buildea la SPA
3. Levanta Docker Compose
4. Verifica que todos los servicios estén listos

### Opción 2: Manual

```bash
# 1. Instalar dependencias
npm install

# 2. Buildear frontend
npm run build

# 3. Levantar servicios
docker-compose up -d

# 4. Esperar a que PostgreSQL esté listo
sleep 10
```

## 🌐 Acceso

- **Frontend**: http://localhost:8000
- **API Base**: http://localhost:8000/api
- **PostgreSQL**: localhost:5432
  - Usuario: `postgres`
  - Contraseña: `postgres_password`
  - Database: `poke_guess`

## 📡 Endpoints API

### Players

```bash
# Agregar/Actualizar jugador
POST /api/players
{
  "id": "player-123",
  "name": "Juan",
  "avatar": "https://..."
}

# Obtener todos los jugadores
GET /api/players

# Obtener jugador específico
GET /api/players/{id}
```

### Scores

```bash
# Agregar puntuación
POST /api/scores
{
  "id": "score-123",
  "player_id": "player-123",
  "correct": 8,
  "total_time_ms": 45000,
  "score": 8
}

# Obtener mejores puntuaciones (top 20)
GET /api/scores/top
GET /api/scores/top/{limit}

# Obtener puntuaciones de un jugador
GET /api/scores/player/{player_id}
```

## 🔧 Configuración

Variables de entorno en `.env`:

```env
DB_HOST=postgres
DB_NAME=poke_guess
DB_USER=postgres
DB_PASS=postgres_password

BACKEND_HOST=http://localhost:8000/api
VITE_API_URL=http://localhost:8000/api
```

## 📁 Estructura del Proyecto

```
poke-guess-game/
├── src/                      # Frontend (Solid.js)
│   ├── App.jsx
│   ├── lib/
│   │   ├── api.js           # PokeAPI client
│   │   └── db.js            # Backend DB client
│   ├── pages/
│   │   ├── Game.jsx
│   │   ├── Home.jsx
│   │   └── Results.jsx
│   └── main.jsx
├── backend/                  # Backend PHP
│   ├── src/
│   │   ├── index.php        # Router principal
│   │   ├── Database.php     # Conexión PDO
│   │   ├── PlayerController.php
│   │   └── ScoreController.php
│   ├── db/
│   │   └── init.sql         # Schema PostgreSQL
│   ├── Dockerfile.php       # Imagen PHP 8.2 FPM
│   └── php.ini
├── nginx/
│   └── default.conf         # Configuración reverse proxy
├── dist/                    # Build del frontend (generado)
├── docker-compose.yml
├── package.json
├── vite.config.js
└── setup.sh                 # Script de setup
```

## 🔍 Verificar que funciona

### 1. Check de servicios

```bash
# Ver estado de containers
docker-compose ps

# Logs en tiempo real
docker-compose logs -f
```

### 2. Test API

```bash
# Crear jugador
curl -X POST http://localhost:8000/api/players \
  -H "Content-Type: application/json" \
  -d '{"id":"test-1","name":"Test Player","avatar":null}'

# Obtener jugadores
curl http://localhost:8000/api/players

# Obtener mejores puntuaciones
curl http://localhost:8000/api/scores/top/5
```

### 3. Database

```bash
# Conectarse a PostgreSQL
docker exec -it poke-guess-db psql -U postgres -d poke_guess

# Listar tablas
\dt

# Ver jugadores
SELECT * FROM players;

# Ver puntuaciones
SELECT * FROM scores;
```

## 🛠️ Desarrollo

### Frontend

```bash
# Dev server con hot reload
npm run dev

# Build de producción
npm run build

# Preview del build
npm run serve
```

### Backend

Para cambios en PHP:

```bash
# Editar archivos en backend/src/
# Los cambios se aplican automáticamente (no requiere rebuild)

# Para ver cambios reflejados, refreshea el navegador
```

## 🧹 Limpieza

```bash
# Detener servicios
docker-compose down

# Detener y remover volúmenes (CUIDADO: pierde datos)
docker-compose down -v

# Remover imágenes
docker-compose down --rmi all
```

## 🐛 Troubleshooting

### "Connection refused" en API

```bash
# Verificar que PHP está listo
docker-compose logs php

# Reiniciar PHP
docker-compose restart php
```

### PostgreSQL no conecta

```bash
# Ver logs de PostgreSQL
docker-compose logs postgres

# Verificar que el volumen está creado
docker volume ls | grep poke

# Reiniciar PostgreSQL
docker-compose restart postgres
```

### Frontend no carga

```bash
# Verificar que Nginx está corriendo
docker-compose logs nginx

# Verificar permisos de dist/
ls -la dist/
```

## 📊 Performance

- **Frontend**: Vite + Solid.js (rápido, reactivo)
- **Backend**: PHP 8.2 FPM (ligero, eficiente)
- **Database**: PostgreSQL 15 (robusto, indexado)
- **Cache**: Browser cache para assets
- **API Cache**: Laravel-style caching (future)

## 🔐 Seguridad

- CORS habilitado (ajustar en producción)
- Prepared statements para prevenir SQL injection
- Validación de entrada básica
- HTTPS no configurado (usar reverse proxy en producción)

## 📝 Notas

- El frontend es una SPA compilada a static files
- El backend es stateless (escalable horizontalmente)
- PostgreSQL persiste datos en volumen `postgres_data`
- Los índices en la DB están optimizados para las queries principales

## 📚 Stack

- **Frontend**: Solid.js, Vite, TypeScript
- **Backend**: PHP 8.2, PDO
- **Database**: PostgreSQL 15
- **Infrastructure**: Docker, Nginx, FPM
