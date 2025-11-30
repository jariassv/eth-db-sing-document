# 📚 ETH Document Registry

<div align="center">

**Una aplicación descentralizada (dApp) completa para almacenar y verificar la autenticidad de documentos utilizando blockchain Ethereum**

[![Solidity](https://img.shields.io/badge/Solidity-^0.8.13-blue)](https://soliditylang.org/)
[![Foundry](https://img.shields.io/badge/Foundry-Latest-orange)](https://getfoundry.sh/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Ethers.js](https://img.shields.io/badge/Ethers.js-6.15.0-yellow)](https://ethers.org/)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Video Demo](#-video-demo)
- [Características](#-características)
- [Arquitectura](#️-arquitectura)
- [Prerrequisitos](#-prerrequisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Testing](#-testing)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Características Técnicas](#-características-técnicas)
- [Troubleshooting](#-troubleshooting)
- [Seguridad](#-seguridad)
- [Roadmap](#-roadmap)
- [Contribuciones](#-contribuciones)
- [Licencia](#-licencia)

---

## 📖 Descripción

**ETH Document Registry** es una aplicación descentralizada que permite almacenar y verificar la autenticidad de documentos utilizando la blockchain de Ethereum. El sistema utiliza hashes criptográficos y firmas digitales para garantizar la integridad y autenticidad de los documentos sin necesidad de almacenar el contenido completo en la blockchain.

### ¿Cómo funciona?

1. **Almacenamiento**: El usuario sube un documento, se calcula su hash criptográfico (Keccak256), y se genera una firma digital usando la clave privada de la wallet.
2. **Registro en Blockchain**: El hash, la firma y los metadatos se almacenan permanentemente en el contrato inteligente.
3. **Verificación**: Cualquier persona puede verificar la autenticidad de un documento comparando su hash y firma con los registros en la blockchain.

### Casos de Uso

- ✅ Certificación de documentos académicos
- ✅ Verificación de contratos legales
- ✅ Autenticación de certificados profesionales
- ✅ Registro de propiedad intelectual
- ✅ Auditoría de documentos corporativos

---

## 🎥 Video Demo

Puedes ver una demostración completa del funcionamiento de la aplicación en el siguiente video:

📹 **[Ver Video Demo](./Demo%20Firma%20Docs.mp4)**

El video muestra el flujo completo de:
- Conexión de wallet
- Carga y firma de documentos
- Almacenamiento en blockchain
- Verificación de autenticidad
- Visualización del historial

---

## 🌟 Características

### 🔐 Seguridad
- **Hash Criptográfico**: Utiliza Keccak256 para generar identificadores únicos e inmutables
- **Firmas Digitales**: Verificación criptográfica de la identidad del firmante
- **Inmutabilidad**: Una vez almacenado, el documento no puede ser modificado
- **Transparencia**: Todos los registros son públicos y verificables

### 🎨 Interfaz de Usuario
- **Diseño Moderno**: UI responsiva con Tailwind CSS y componentes modernos
- **Experiencia Intuitiva**: Flujo de trabajo claro y fácil de seguir
- **Feedback Visual**: Indicadores de estado y mensajes informativos
- **Multi-wallet**: Soporte para múltiples wallets derivadas de Anvil

### ⚡ Rendimiento
- **Optimización de Gas**: Contrato optimizado para reducir costos de transacción
- **Carga Rápida**: Interfaz ligera y eficiente
- **Actualización en Tiempo Real**: Historial actualizado automáticamente

### 🧪 Desarrollo
- **Testing Completo**: Suite de tests con cobertura completa
- **Desarrollo Local**: Entorno completo con Anvil para desarrollo local
- **Scripts Automatizados**: Scripts de configuración y despliegue

---

## 🏗️ Arquitectura

### Stack Tecnológico

#### Smart Contracts
- **Solidity** ^0.8.13
- **Foundry** (Forge, Anvil, Cast)
- **Optimización**: Struct optimizado sin campos redundantes

#### Frontend
- **Next.js** 16.0.1 (App Router)
- **React** 19.2.0
- **TypeScript** 5.0
- **Ethers.js** 6.15.0
- **Tailwind CSS** 4.0

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ FileUploader │  │DocumentSigner│  │DocumentVerif.│  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
│  ┌──────▼─────────────────▼──────────────────▼──────┐  │
│  │         MetaMaskContext (Wallet Management)       │  │
│  └──────────────────────┬───────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────▼───────────────────────────┐  │
│  │           useContract Hook (Ethers.js)            │  │
│  └──────────────────────┬───────────────────────────┘  │
└─────────────────────────┼───────────────────────────────┘
                          │
                          │ JSON-RPC
                          │
┌─────────────────────────▼───────────────────────────────┐
│              Anvil (Local Ethereum Node)                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │         DocumentRegistry.sol (Smart Contract)      │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  - storeDocumentHash()                       │  │  │
│  │  │  - verifyDocument()                          │  │  │
│  │  │  - getDocumentInfo()                         │  │  │
│  │  │  - isDocumentStored()                        │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

### Componentes Principales

#### Smart Contract: `DocumentRegistry.sol`
- **Almacenamiento**: Mapping de hash a información del documento
- **Verificación**: Funciones para verificar autenticidad
- **Eventos**: DocumentStored, DocumentVerified
- **Optimización**: ~39% de ahorro en gas vs. implementación estándar

#### Frontend Components
- **FileUploader**: Carga de archivos y cálculo de hash
- **DocumentSigner**: Firma digital y almacenamiento en blockchain
- **DocumentVerifier**: Verificación de autenticidad de documentos
- **DocumentHistory**: Visualización del historial completo

---

## 📦 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (o yarn/pnpm)
- **Foundry** (Forge, Anvil, Cast)
- **Git**

### Instalación de Foundry

```bash
# Instalar Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verificar instalación
forge --version
anvil --version
cast --version
```

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <tu-repositorio>
cd 01-ETHDatabaseDocument
```

### 2. Configurar Smart Contracts

```bash
cd sc
forge install
forge build
forge test
```

### 3. Configurar Frontend

```bash
cd ../dapp
npm install
```

### 4. Configuración Automática (Recomendado)

El proyecto incluye un script de configuración que automatiza todo el proceso:

```bash
# Desde la raíz del proyecto
chmod +x setup.sh
./setup.sh
```

Este script:
- ✅ Verifica e inicia Anvil si es necesario
- ✅ Compila los contratos
- ✅ Ejecuta los tests
- ✅ Despliega el contrato en Anvil
- ✅ Crea el archivo `.env.local` con las configuraciones necesarias

---

## ⚙️ Configuración

### Variables de Entorno

El archivo `.env.local` se genera automáticamente con `setup.sh`, pero puedes crearlo manualmente:

```env
# dapp/.env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_MNEMONIC="test test test test test test test test test test test junk"
```

### Wallets de Anvil

El sistema deriva automáticamente 10 wallets desde el mnemonic de Anvil:

| Wallet | Dirección | Balance Inicial |
|--------|-----------|-----------------|
| Wallet 0 | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | 1000 ETH |
| Wallet 1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | 1000 ETH |
| ... | ... | ... |
| Wallet 9 | `0x8ba1f109551bD432803012645Hac136c22C19e00` | 1000 ETH |

---

## 🎯 Uso

### Inicio Rápido

#### Opción 1: Usando el Script de Configuración (Recomendado)

```bash
# Ejecutar el script de configuración
./setup.sh

# En otra terminal, iniciar el frontend
cd dapp
npm run dev
```

#### Opción 2: Manual

**Terminal 1: Iniciar Anvil**
```bash
anvil --accounts 10 --balance 1000
```

**Terminal 2: Desplegar Contrato**
```bash
cd sc
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
forge script script/Deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast
```

**Terminal 3: Iniciar Frontend**
```bash
cd dapp
npm run dev
```

**Abrir en el navegador**: `http://localhost:3000`

### Flujo de Trabajo

#### 1. Firmar un Documento

1. **Conectar Wallet**
   - Haz clic en "Conectar Wallet"
   - Selecciona una de las 10 wallets disponibles

2. **Subir Archivo**
   - Ve a la pestaña "Upload & Sign"
   - Selecciona un archivo (PDF, DOCX, TXT, etc.)
   - El hash se calcula automáticamente

3. **Firmar Documento**
   - Haz clic en "Sign Document"
   - Confirma la firma en el diálogo
   - Se genera una firma digital única

4. **Almacenar en Blockchain**
   - Haz clic en "Store on Blockchain"
   - Confirma la transacción
   - Espera la confirmación (puede tardar unos segundos)

#### 2. Verificar un Documento

1. **Subir Archivo a Verificar**
   - Ve a la pestaña "Verify"
   - Selecciona el mismo archivo que se firmó originalmente

2. **Ingresar Dirección del Firmante**
   - Ingresa la dirección de la wallet que firmó el documento
   - Ejemplo: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

3. **Verificar**
   - Haz clic en "Verify Document"
   - El sistema comparará el hash y la firma
   - Verás el resultado: ✅ Válido o ❌ Inválido

#### 3. Ver Historial

- Ve a la pestaña "History"
- Visualiza todos los documentos almacenados
- Información mostrada:
  - Hash del documento
  - Dirección del firmante
  - Fecha y hora de almacenamiento
  - Firma digital

---

## 🧪 Testing

### Smart Contracts

```bash
cd sc

# Ejecutar todos los tests
forge test

# Tests con logs detallados
forge test -vv

# Tests con logs muy detallados
forge test -vvv

# Cobertura de código
forge coverage

# Gas report
forge snapshot
```

**Resultados Esperados**:
- ✅ 11/11 tests pasando
- ✅ Cobertura completa de funciones críticas

### Frontend

```bash
cd dapp

# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Linter
npm run lint

# Iniciar servidor de producción
npm start
```

### Tests Manuales

1. **Test de Almacenamiento**
   - Sube un documento
   - Fírmalo y almacénalo
   - Verifica que aparece en el historial

2. **Test de Verificación**
   - Verifica un documento existente
   - Verifica un documento inexistente
   - Verifica con dirección incorrecta

3. **Test de Integridad**
   - Modifica un documento después de firmarlo
   - Intenta verificar el documento modificado
   - Debe fallar la verificación

---

## 📁 Estructura del Proyecto

```
01-ETHDatabaseDocument/
│
├── sc/                              # Smart Contracts (Foundry)
│   ├── src/
│   │   └── DocumentRegistry.sol    # Contrato principal
│   ├── test/
│   │   └── DocumentRegistry.t.sol   # Tests del contrato
│   ├── script/
│   │   └── Deploy.s.sol             # Script de despliegue
│   ├── foundry.toml                 # Configuración de Foundry
│   ├── lib/                         # Dependencias (forge-std)
│   ├── out/                         # Artefactos compilados
│   ├── cache/                       # Cache de compilación
│   └── broadcast/                   # Historial de despliegues
│
├── dapp/                            # Frontend (Next.js)
│   ├── app/
│   │   ├── page.tsx                 # Página principal
│   │   ├── layout.tsx               # Layout principal
│   │   └── globals.css              # Estilos globales
│   ├── components/
│   │   ├── FileUploader.tsx         # Componente de carga de archivos
│   │   ├── DocumentSigner.tsx       # Componente de firma
│   │   ├── DocumentVerifier.tsx    # Componente de verificación
│   │   ├── DocumentHistory.tsx     # Componente de historial
│   │   └── ConfirmDialog.tsx        # Diálogo de confirmación
│   ├── contexts/
│   │   └── MetaMaskContext.tsx      # Context de wallets
│   ├── hooks/
│   │   └── useContract.ts           # Hook para interactuar con el contrato
│   ├── lib/
│   │   └── abi.ts                   # ABI del contrato
│   ├── public/                      # Archivos estáticos
│   ├── package.json                 # Dependencias del frontend
│   └── .env.local                   # Variables de entorno (generado)
│
├── setup.sh                         # Script de configuración automática
├── stop.sh                          # Script para detener servicios
└── README.md                        # Este archivo
```

---

## 📊 Características Técnicas

### Smart Contract

#### Optimizaciones
- **Struct Optimizado**: Sin campo `exists` redundante (verificación con `signer != address(0)`)
- **Ahorro de Gas**: ~39% menos gas que implementación estándar
- **Modifiers**: Validación eficiente con modifiers reutilizables
- **Eventos Indexados**: Eventos optimizados para indexación

#### Funciones Principales

```solidity
// Almacenar documento
function storeDocumentHash(
    bytes32 _hash,
    uint256 _timestamp,
    bytes memory _signature,
    address _signer
) external

// Verificar documento (con evento)
function verifyDocument(
    bytes32 _hash,
    address _signer,
    bytes memory _signature
) external returns (bool)

// Verificar documento (solo lectura)
function verifyDocumentView(
    bytes32 _hash,
    address _signer,
    bytes memory _signature
) external view returns (bool)

// Obtener información del documento
function getDocumentInfo(bytes32 _hash) 
    external view returns (Document memory)

// Verificar si existe
function isDocumentStored(bytes32 _hash) 
    external view returns (bool)

// Obtener cantidad de documentos
function getDocumentCount() 
    external view returns (uint256)
```

#### Eventos

```solidity
event DocumentStored(
    bytes32 indexed hash,
    address indexed signer,
    uint256 timestamp
);

event DocumentVerified(
    bytes32 indexed hash,
    address signer,
    bool isValid
);
```

### Frontend

#### Tecnologías
- **Next.js 16**: Framework React con App Router
- **TypeScript**: Tipado estático completo
- **Ethers.js v6**: Interacción con blockchain
- **Tailwind CSS 4**: Estilos utilitarios
- **React Context API**: Gestión de estado global

#### Hooks Personalizados

```typescript
// useContract: Interacción con el contrato
const {
  storeDocumentHash,
  verifyDocument,
  getDocumentInfo,
  isDocumentStored,
  getDocumentCount,
  getAllDocuments
} = useContract();

// useMetaMask: Gestión de wallets
const {
  isConnected,
  currentWallet,
  wallets,
  connect,
  disconnect,
  switchWallet,
  signMessage
} = useMetaMask();
```

---

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Anvil no inicia

**Síntoma**: Error al iniciar Anvil o puerto 8545 ocupado

**Solución**:
```bash
# Verificar si el puerto está en uso
lsof -i :8545

# Matar proceso si es necesario
kill -9 <PID>

# O usar otro puerto
anvil --port 8546
```

#### 2. Contrato no despliega

**Síntoma**: Error al desplegar el contrato

**Solución**:
```bash
# Verificar que Anvil está corriendo
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545

# Verificar la clave privada
# Debe ser la primera wallet de Anvil
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

#### 3. Frontend no conecta a Anvil

**Síntoma**: El frontend no puede conectarse a la blockchain

**Solución**:
```bash
# Verificar .env.local
cat dapp/.env.local

# Verificar que NEXT_PUBLIC_RPC_URL apunta a Anvil
# Debe ser: http://localhost:8545

# Reiniciar el servidor de desarrollo
cd dapp
npm run dev
```

#### 4. Error "Document already exists"

**Síntoma**: Intento de almacenar un documento que ya existe

**Solución**: 
- Cada hash es único
- Si quieres almacenar el mismo archivo de nuevo, modifícalo ligeramente
- O verifica primero si ya existe con `isDocumentStored()`

#### 5. Error de firma

**Síntoma**: Error al firmar el documento

**Solución**:
```bash
# Verificar que la wallet está conectada
# Verificar que el hash no está vacío
# Verificar la consola del navegador para más detalles
```

### Logs y Debugging

```bash
# Ver logs de Anvil
tail -f /tmp/anvil.log

# Ver logs del frontend
# Abrir DevTools > Console en el navegador

# Ver logs de transacciones
cast tx <TX_HASH> --rpc-url http://localhost:8545
```

---

## 🔒 Seguridad

### Consideraciones de Seguridad

#### Smart Contract
- ✅ **Validación de Entrada**: Modifiers para validar existencia de documentos
- ✅ **Prevención de Duplicados**: No se pueden almacenar documentos duplicados
- ✅ **Inmutabilidad**: Una vez almacenado, el documento no puede ser modificado
- ⚠️ **Limitación**: El contrato no valida la firma criptográficamente (solo compara bytes)

#### Frontend
- ✅ **Validación de Archivos**: Verificación de tipo y tamaño
- ✅ **Manejo de Errores**: Try-catch en todas las operaciones asíncronas
- ✅ **Confirmaciones**: Diálogos de confirmación para operaciones críticas
- ⚠️ **Claves Privadas**: Las wallets de Anvil son solo para desarrollo

### Mejores Prácticas

1. **Nunca compartas tu clave privada**
2. **Verifica siempre las direcciones de contrato**
3. **Usa testnets para pruebas antes de mainnet**
4. **Revisa el código del contrato antes de desplegar**
5. **Mantén tus dependencias actualizadas**

### Auditoría

Para producción, se recomienda:
- ✅ Auditoría de seguridad del contrato
- ✅ Tests de penetración
- ✅ Revisión de código por pares
- ✅ Análisis estático de código

---

## 🗺️ Roadmap

### ✅ Completado

- [x] Smart Contract optimizado
- [x] Tests completos (11/11)
- [x] Frontend completo con Next.js
- [x] Integración con Anvil
- [x] Sistema de wallets múltiples
- [x] Verificación de documentos
- [x] Historial de documentos

### 🚧 En Progreso

- [ ] Documentación de API
- [ ] Tests E2E del frontend

### 📋 Próximas Mejoras

#### Corto Plazo
- [ ] Drag & Drop para subir archivos
- [ ] Exportar historial a CSV
- [ ] Búsqueda y filtrado en historial
- [ ] Dark mode toggle
- [ ] Animaciones de transición

#### Medio Plazo
- [ ] Pruebas en testnet (Sepolia)
- [ ] Integración con IPFS para almacenar archivos completos
- [ ] Soporte para múltiples firmantes
- [ ] Sistema de notificaciones

#### Largo Plazo
- [ ] Integración con ENS para nombres legibles
- [ ] Subgraph para indexación de eventos
- [ ] PWA para uso offline
- [ ] App móvil (React Native)
- [ ] Integración con otros blockchains (Polygon, Arbitrum)

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. **Fork** el proyecto
2. **Crea una rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre un Pull Request**

### Guía de Contribución

- Sigue las convenciones de código existentes
- Añade tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Asegúrate de que todos los tests pasen

### Reportar Bugs

Si encuentras un bug, por favor:
1. Abre un issue en GitHub
2. Describe el problema claramente
3. Incluye pasos para reproducir
4. Añade logs relevantes si es posible

---

## 📝 Licencia

Este proyecto es para fines educativos y de demostración.

---

## 👥 Autores

Desarrollado como parte del curso de práctica con Ethereum.

---

## 🙏 Agradecimientos

- **Foundry Team** por las herramientas de desarrollo
- **Next.js Team** por el framework
- **Ethers.js Team** por la librería de blockchain
- **Comunidad Ethereum** por el ecosistema

---

<div align="center">

**¡Desarrollado con ❤️ usando Solidity, Foundry, Next.js y Ethers.js!**

[⬆ Volver arriba](#-eth-document-registry)

</div>
