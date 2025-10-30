#!/bin/bash

# Script para detener Anvil y Next.js iniciados por setup.sh

echo "🛑 Deteniendo servicios..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/.pids"

if [ -f "$PID_FILE" ]; then
  while IFS= read -r pid; do
    if ps -p "$pid" > /dev/null 2>&1; then
      kill "$pid" 2>/dev/null && echo "   ✅ Proceso $pid detenido"
    fi
  done < "$PID_FILE"
  rm -f "$PID_FILE"
  echo "✅ Todos los procesos han sido detenidos"
else
  echo "⚠️  No se encontró archivo de PIDs (.pids)"
  echo "💡 Los procesos pueden haberse detenido manualmente"
fi

