#!/bin/bash

echo "🚀 Configurando ETH Document Registry..."

# Crear archivo .env.local con la dirección del contrato desplegado
cat > dapp/.env.local << 'EOF'
# Configuración de la aplicación
NEXT_PUBLIC_CONTRACT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_MNEMONIC="test test test test test test test test test test test junk"
EOF

echo "✅ Archivo .env.local creado con la dirección del contrato desplegado"
echo "📋 Dirección del contrato: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
echo ""
echo "🔧 Para probar la aplicación:"
echo "1. Asegúrate de que Anvil esté corriendo: anvil"
echo "2. Inicia el frontend: cd dapp && npm run dev"
echo "3. Abre http://localhost:3000 en tu navegador"
echo ""
echo "🎯 Flujo de prueba:"
echo "1. Conecta una wallet (Wallet 0-9)"
echo "2. Ve a 'Upload & Sign'"
echo "3. Sube un archivo de prueba"
echo "4. Firma y almacena el documento"
echo "5. Ve a 'Verify' para verificar el documento"
echo "6. Ve a 'History' para ver el historial"
