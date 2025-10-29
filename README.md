# 📚 ETH Document Registry

Una **aplicación descentralizada (dApp)** completa para almacenar y verificar la autenticidad de documentos utilizando blockchain Ethereum.

## 🌟 Características

- ✅ **Almacenamiento seguro**: Hash criptográfico + firma digital en blockchain
- ✅ **Verificación de autenticidad**: Comparación de hash y firma
- ✅ **Interfaz moderna**: UI responsiva con Next.js y Tailwind CSS
- ✅ **Wallets integradas**: 10 wallets derivadas de Anvil para testing
- ✅ **Historial completo**: Visualización de todos los documentos almacenados
- ✅ **Desarrollo local**: Usando Anvil (nodo Ethereum local)

## 🏗️ Arquitectura

### Smart Contracts (Solidity + Foundry)
- **DocumentRegistry.sol**: Contrato optimizado para almacenar documentos
- **Tests completos**: 11/11 tests pasando con cobertura completa
- **Script de despliegue**: Despliegue automático en Anvil

### Frontend (Next.js + TypeScript)
- **MetaMaskContext**: Gestión de wallets derivadas de Anvil
- **useContract**: Hook para interactuar con el contrato
- **Componentes UI**: FileUploader, DocumentSigner, DocumentVerifier, DocumentHistory

## 🚀 Instalación y Configuración

### Prerrequisitos

```bash
# Node.js (v18+)
node --version

# Foundry (Forge, Cast, Anvil)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Git
git --version
```

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd eth-database-document
```

### 2. Configurar Smart Contracts

```bash
cd sc
forge build
forge test
```

### 3. Configurar Frontend

```bash
cd ../dapp
npm install
```

### 4. Configurar variables de entorno

```bash
# El script setup.sh crea automáticamente el archivo .env.local
./setup.sh
```

## 🎯 Uso

### 1. Iniciar Anvil (Terminal 1)

```bash
anvil --accounts 10 --balance 1000
```

### 2. Desplegar Contrato (Terminal 2)

```bash
cd sc
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

### 3. Iniciar Frontend (Terminal 3)

```bash
cd dapp
npm run dev
```

### 4. Abrir la aplicación

Navega a `http://localhost:3000` en tu navegador.

## 📋 Flujo de Trabajo

### Firmar Documento
1. **Conectar Wallet**: Selecciona una de las 10 wallets disponibles
2. **Subir Archivo**: Selecciona un archivo (se calcula el hash automáticamente)
3. **Firmar**: Confirma la firma del documento
4. **Almacenar**: Guarda el documento en la blockchain

### Verificar Documento
1. **Subir Archivo**: Selecciona el archivo a verificar
2. **Ingresar Firmante**: Dirección de la wallet que firmó originalmente
3. **Verificar**: Comprueba la autenticidad del documento

### Ver Historial
- Visualiza todos los documentos almacenados
- Información completa: hash, firmante, fecha, firma
- Actualización en tiempo real

## 🧪 Testing

### Smart Contracts
```bash
cd sc
forge test -vv
forge coverage
```

### Frontend
```bash
cd dapp
npm run build
npm run dev
```

## 📁 Estructura del Proyecto

```
eth-database-document/
├── sc/                          # Smart Contracts
│   ├── src/
│   │   └── DocumentRegistry.sol
│   ├── test/
│   │   └── DocumentRegistry.t.sol
│   ├── script/
│   │   └── Deploy.s.sol
│   └── foundry.toml
├── dapp/                        # Frontend
│   ├── app/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── FileUploader.tsx
│   │   ├── DocumentSigner.tsx
│   │   ├── DocumentVerifier.tsx
│   │   └── DocumentHistory.tsx
│   ├── contexts/
│   │   └── MetaMaskContext.tsx
│   ├── hooks/
│   │   └── useContract.ts
│   ├── lib/
│   │   └── abi.ts
│   └── package.json
├── setup.sh                     # Script de configuración
└── README.md
```

## 🔧 Configuración Avanzada

### Variables de Entorno

```env
# dapp/.env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_MNEMONIC="test test test test test test test test test test test junk"
```

### Wallets de Anvil

El sistema deriva automáticamente 10 wallets desde el mnemonic de Anvil:
- Wallet 0: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Wallet 1: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- ... (hasta Wallet 9)

## 🛠️ Desarrollo

### Comandos Útiles

```bash
# Smart Contracts
forge build                 # Compilar
forge test -vv             # Tests con logs
forge coverage             # Cobertura
forge clean               # Limpiar cache

# Frontend
npm run dev               # Desarrollo
npm run build             # Build producción
npm run lint              # Linter

# Anvil
anvil                     # Iniciar nodo local
anvil --accounts 20       # Con 20 cuentas
```

### Debugging

**Problema**: Contrato no despliega
```bash
# Verificar Anvil corriendo
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545
```

**Problema**: Frontend no conecta
```bash
# Verificar .env.local
cat dapp/.env.local

# Verificar logs del navegador
# Abrir DevTools > Console
```

## 📊 Características Técnicas

### Smart Contract
- **Optimización**: Struct sin campos redundantes (ahorro ~39% gas)
- **Seguridad**: Modifiers para validación
- **Eventos**: DocumentStored, DocumentVerified
- **Funciones**: storeDocumentHash, verifyDocument, getDocumentInfo, etc.

### Frontend
- **Framework**: Next.js 14 con App Router
- **Styling**: Tailwind CSS
- **Blockchain**: Ethers.js v6
- **Estado**: React Context API
- **Tipado**: TypeScript completo

## 🎉 Funcionalidades Implementadas

### ✅ Fase 1: Smart Contracts
- [x] Contrato DocumentRegistry optimizado
- [x] Tests completos (11/11 pasando)
- [x] Script de despliegue
- [x] Cobertura de código

### ✅ Fase 2: Frontend dApp
- [x] Context Provider con wallets de Anvil
- [x] Hook useContract funcional
- [x] Componentes UI completos
- [x] Página principal con tabs
- [x] Selector de wallet

### ✅ Fase 3: Integración
- [x] Conexión frontend-contrato
- [x] Firmas funcionando
- [x] Almacenamiento en blockchain
- [x] Verificación de documentos
- [x] Historial de documentos

## 🚀 Próximos Pasos

### Mejoras Opcionales
1. **Drag & Drop** para subir archivos
2. **Exportar lista** de documentos a CSV
3. **Búsqueda/filtrado** en historial
4. **Dark mode** toggle
5. **Animaciones** de transición
6. **Pruebas en testnet** (Sepolia)
7. **IPFS** para almacenar archivo completo
8. **ENS** para nombres legibles
9. **Subgraph** para indexar eventos
10. **PWA** para uso offline

## 📝 Licencia

Este proyecto es para fines educativos y de demostración.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**¡Desarrollado con ❤️ usando Solidity, Foundry, Next.js y Ethers.js!**
