#!/bin/bash
# Script para transformar un backup custom de Postgres a SQL plano dentro de un contenedor Docker
# Uso: ./transformando_backup.sh <nombre_del_contenedor_postgres> <ruta_al_dump>

set -e

CONTAINER_NAME=${1:-postgres_db}
DUMP_PATH=${2:-/database/BCK_BD_CERAGEN.dump}
PLAIN_SQL_PATH=${3:-/database/BCK_BD_CERAGEN.sql}
DB_NAME=${4:-ws_ceragen}
DB_USER=${5:-postgres}

# Copia el dump al contenedor si no está
if ! docker exec "$CONTAINER_NAME" test -f "$DUMP_PATH"; then
  docker cp "$(pwd)/database/BCK_BD_CERAGEN.sql" "$CONTAINER_NAME:$DUMP_PATH"
fi

echo "Restaurando el dump custom en el contenedor (sin cambiar ownership)..."
docker exec -u "$DB_USER" "$CONTAINER_NAME" pg_restore --no-owner -d "$DB_NAME" "$DUMP_PATH"

echo "Generando backup en SQL plano..."
docker exec -u "$DB_USER" "$CONTAINER_NAME" pg_dump -d "$DB_NAME" --format=plain --no-owner --no-privileges -f "$PLAIN_SQL_PATH"

echo "Copiando el SQL plano a tu máquina..."
docker cp "$CONTAINER_NAME:$PLAIN_SQL_PATH" "$(pwd)/database/BCK_BD_CERAGEN.sql"

echo "¡Listo! Ahora puedes usar el archivo BCK_BD_CERAGEN.sql en tu docker-compose.yaml."
