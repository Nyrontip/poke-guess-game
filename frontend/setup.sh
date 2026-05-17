#!/bin/bash

set -e

echo "🚀 Iniciando setup del proyecto Poke Guess Game"

# Verificar que estamos en la carpeta correcta
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json no encontrado. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
fi

# Buildear el frontend
echo "🔨 Buildeando frontend..."
npm run build

# Verificar que dist existe
if [ ! -d "dist" ]; then
    echo "❌ Error: Build falló, dist/ no existe"
    exit 1
fi

# Levantar Docker Compose
echo "🐳 Levantando Docker Compose..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios se inicialicen..."
sleep 5

# Verificar que PostgreSQL está listo
echo "🔍 Verificando PostgreSQL..."
for i in {1..30}; do
    if docker exec poke-guess-db pg_isready -U postgres >/dev/null 2>&1; then
        echo "✅ PostgreSQL está listo"
        break
    fi
    echo "⏳ Esperando PostgreSQL... ($i/30)"
    sleep 1
done

# Verificar que PHP está listo
echo "🔍 Verificando PHP..."
sleep 2

echo ""
echo "✅ Setup completado!"
echo ""
echo "🌐 Accede a la aplicación en: http://localhost:8000"
echo ""
echo "📝 Comandos útiles:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Conectarse a PostgreSQL: psql -h localhost -U postgres -d poke_guess"
echo "  - Detener servicios: docker-compose down"
echo "  - Remover volúmenes: docker-compose down -v"
echo ""
