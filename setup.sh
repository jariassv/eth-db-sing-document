#!/bin/bash

set -e

echo "🚀 Configurando ETH Document Registry..."
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para verificar si un puerto está en uso
check_port() {
  local port=$1
  if command -v lsof > /dev/null 2>&1; then
    lsof -ti:$port > /dev/null 2>&1
  elif command -v netstat > /dev/null 2>&1; then
    netstat -tuln 2>/dev/null | grep -q ":$port "
  else
    # Fallback: intentar conexión
    timeout 1 bash -c "echo > /dev/tcp/localhost/$port" 2>/dev/null
  fi
}

# Función para verificar si Anvil está respondiendo
check_anvil() {
  curl -s -X POST -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
    http://localhost:8545 > /dev/null 2>&1
}

# Verificar o iniciar Anvil
echo -e "${BLUE}📡 Verificando Anvil...${NC}"
if check_anvil; then
  echo -e "${GREEN}✅ Anvil ya está corriendo${NC}"
  ANVIL_STARTED=false
else
  if check_port 8545; then
    echo -e "${YELLOW}⚠️  Puerto 8545 está en uso pero Anvil no responde${NC}"
    echo -e "${YELLOW}💡 Puede que necesites reiniciar Anvil manualmente${NC}"
    exit 1
  else
    echo -e "${YELLOW}⚠️  Anvil no está corriendo. Iniciando...${NC}"
    anvil --accounts 10 --balance 1000 > /tmp/anvil.log 2>&1 &
    ANVIL_PID=$!
    echo -e "${BLUE}   Esperando a que Anvil esté listo...${NC}"
    
    # Esperar hasta 10 segundos a que Anvil esté listo
    MAX_WAIT=10
    WAITED=0
    while [ $WAITED -lt $MAX_WAIT ]; do
      if check_anvil; then
        echo -e "${GREEN}✅ Anvil iniciado correctamente (PID: $ANVIL_PID)${NC}"
        ANVIL_STARTED=true
        break
      fi
      sleep 1
      WAITED=$((WAITED + 1))
      echo -n "."
    done
    echo ""
    
    if [ "$ANVIL_STARTED" != "true" ]; then
      echo -e "${RED}❌ Error: Anvil no respondió después de ${MAX_WAIT} segundos${NC}"
      echo -e "${YELLOW}💡 Revisa los logs en /tmp/anvil.log${NC}"
      kill $ANVIL_PID 2>/dev/null || true
      exit 1
    fi
  fi
fi
echo ""

# Ir al directorio de smart contracts
cd sc

# Compilar el contrato
echo -e "${BLUE}🔨 Compilando contrato...${NC}"
if ! forge build > /dev/null 2>&1; then
  echo -e "${RED}❌ Error al compilar el contrato${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Contrato compilado exitosamente${NC}"
echo ""

# Desplegar el contrato
echo -e "${BLUE}📦 Desplegando contrato a Anvil...${NC}"
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Ejecutar el script de despliegue y capturar la dirección
echo "   Desplegando contrato..."
DEPLOY_OUTPUT=$(PRIVATE_KEY=$PRIVATE_KEY forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast 2>&1)
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP 'DocumentRegistry deployed at: \K0x[a-fA-F0-9]{40}' || echo "")

if [ -z "$CONTRACT_ADDRESS" ]; then
  # Intentar extraer de otra forma del output
  CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP 'Contract created: \K0x[a-fA-F0-9]{40}' || echo "")
fi

if [ -z "$CONTRACT_ADDRESS" ]; then
  echo -e "${YELLOW}⚠️  No se pudo extraer la dirección del contrato del output${NC}"
  echo -e "${BLUE}📋 Buscando en archivos de broadcast...${NC}"
  
  # Buscar en el archivo de broadcast más reciente
  BROADCAST_FILE="broadcast/Deploy.s.sol/31337/run-latest.json"
  if [ -f "$BROADCAST_FILE" ]; then
    # Intentar con jq si está disponible
    if command -v jq > /dev/null 2>&1; then
      CONTRACT_ADDRESS=$(jq -r '.transactions[0].contractAddress // empty' "$BROADCAST_FILE" 2>/dev/null || echo "")
    fi
    
    # Si aún no tenemos la dirección, usar grep
    if [ -z "$CONTRACT_ADDRESS" ]; then
      CONTRACT_ADDRESS=$(grep -o '"contractAddress":"0x[a-fA-F0-9]\{40\}"' "$BROADCAST_FILE" | head -1 | grep -o '0x[a-fA-F0-9]\{40\}' | head -1 || echo "")
    fi
  fi
fi

if [ -z "$CONTRACT_ADDRESS" ]; then
  echo -e "${RED}❌ Error: No se pudo obtener la dirección del contrato desplegado${NC}"
  echo -e "${YELLOW}💡 Verifica manualmente en: sc/broadcast/Deploy.s.sol/31337/run-latest.json${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Contrato desplegado exitosamente${NC}"
echo -e "${GREEN}📋 Dirección del contrato: ${CONTRACT_ADDRESS}${NC}"
echo ""

# Volver al directorio raíz
cd ..

# Crear archivo .env.local con la dirección del contrato
echo -e "${BLUE}📝 Creando archivo .env.local...${NC}"
cat > dapp/.env.local << EOF
# Configuración de la aplicación
NEXT_PUBLIC_CONTRACT_ADDRESS=${CONTRACT_ADDRESS}
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_MNEMONIC="test test test test test test test test test test test junk"
EOF

echo -e "${GREEN}✅ Archivo .env.local creado${NC}"
echo ""

# Verificar o iniciar servidor Next.js
echo -e "${BLUE}🌐 Verificando servidor web...${NC}"
if check_port 3000; then
  echo -e "${GREEN}✅ Servidor web ya está corriendo en http://localhost:3000${NC}"
  WEB_STARTED=false
else
  echo -e "${YELLOW}⚠️  Servidor web no está corriendo. Iniciando...${NC}"
  
  # Verificar que exista node_modules
  if [ ! -d "dapp/node_modules" ]; then
    echo -e "${BLUE}   Instalando dependencias (esto puede tardar)...${NC}"
    cd dapp
    npm install > /dev/null 2>&1 || {
      echo -e "${RED}❌ Error al instalar dependencias${NC}"
      exit 1
    }
    cd ..
  fi
  
  # Iniciar servidor en segundo plano
  cd dapp
  npm run dev > /tmp/nextjs.log 2>&1 &
  NEXTJS_PID=$!
  cd ..
  
  echo -e "${BLUE}   Esperando a que el servidor esté listo...${NC}"
  
  # Esperar hasta 20 segundos a que Next.js esté listo
  MAX_WAIT=20
  WAITED=0
  while [ $WAITED -lt $MAX_WAIT ]; do
    if check_port 3000; then
      # Esperar un poco más para que Next.js termine de compilar
      sleep 2
      echo ""
      echo -e "${GREEN}✅ Servidor web iniciado correctamente (PID: $NEXTJS_PID)${NC}"
      WEB_STARTED=true
      break
    fi
    sleep 1
    WAITED=$((WAITED + 1))
    echo -n "."
  done
  echo ""
  
  if [ "$WEB_STARTED" != "true" ]; then
    echo -e "${YELLOW}⚠️  El servidor puede estar iniciándose aún${NC}"
    echo -e "${YELLOW}💡 Revisa los logs en /tmp/nextjs.log o espera unos segundos más${NC}"
    WEB_STARTED=false
  fi
fi
echo ""

# Guardar PIDs en un archivo para poder detenerlos después
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/.pids"

if [ "$ANVIL_STARTED" = "true" ]; then
  echo "$ANVIL_PID" > "$PID_FILE"
fi

if [ "$WEB_STARTED" = "true" ]; then
  echo "$NEXTJS_PID" >> "$PID_FILE"
fi

# Mostrar resumen
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✅ Configuración completada exitosamente${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📋 Dirección del contrato: ${NC}${GREEN}${CONTRACT_ADDRESS}${NC}"
echo ""

if [ "$ANVIL_STARTED" = "true" ]; then
  echo -e "${YELLOW}📡 Anvil iniciado en segundo plano (PID: $ANVIL_PID)${NC}"
  echo -e "${BLUE}   Logs: /tmp/anvil.log${NC}"
fi

if [ "$WEB_STARTED" = "true" ]; then
  echo -e "${YELLOW}🌐 Servidor web iniciado en segundo plano (PID: $NEXTJS_PID)${NC}"
  echo -e "${BLUE}   Logs: /tmp/nextjs.log${NC}"
fi

echo ""
echo -e "${YELLOW}🔗 Accesos:${NC}"
echo "   • Anvil: http://localhost:8545"
echo "   • Frontend: ${GREEN}http://localhost:3000${NC}"
echo ""

if [ "$ANVIL_STARTED" = "true" ] || [ "$WEB_STARTED" = "true" ]; then
  echo -e "${YELLOW}💡 Para detener los procesos en segundo plano:${NC}"
  echo "   ${BLUE}kill \$(cat .pids) 2>/dev/null || true${NC}"
  echo ""
fi

echo -e "${YELLOW}🎯 Flujo de prueba:${NC}"
echo "1. Abre ${GREEN}http://localhost:3000${NC} en tu navegador"
echo "2. Conecta una wallet (Wallet 0-9)"
echo "3. Ve a 'Upload & Sign'"
echo "4. Sube un archivo de prueba"
echo "5. Firma y almacena el documento"
echo "6. Ve a 'Verify' para verificar el documento"
echo "7. Ve a 'History' para ver el historial"
echo ""
