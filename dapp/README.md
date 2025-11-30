# 🌐 Frontend - ETH Document Registry dApp

<div align="center">

**Aplicación web descentralizada para registro y verificación de documentos**

[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Ethers.js](https://img.shields.io/badge/Ethers.js-6.15.0-yellow)](https://ethers.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Componentes](#-componentes)
- [Hooks Personalizados](#-hooks-personalizados)
- [Desarrollo](#-desarrollo)
- [Build y Despliegue](#-build-y-despliegue)
- [Troubleshooting](#-troubleshooting)

---

## 📖 Descripción

Este es el frontend de la aplicación ETH Document Registry, una dApp completa construida con Next.js que permite a los usuarios:

- 📤 **Subir y firmar documentos** digitalmente
- ✅ **Verificar la autenticidad** de documentos almacenados
- 📜 **Ver el historial completo** de documentos registrados

La aplicación se conecta a un contrato inteligente desplegado en Ethereum (o Anvil para desarrollo local) y utiliza wallets derivadas de Anvil para facilitar el desarrollo y testing.

---

## 🌟 Características

### Interfaz de Usuario

- ✨ **Diseño Moderno**: UI responsiva con Tailwind CSS
- 🎨 **Componentes Reutilizables**: Arquitectura modular y escalable
- 📱 **Responsive**: Optimizado para desktop, tablet y móvil
- ⚡ **Rendimiento**: Carga rápida y navegación fluida
- 🎯 **UX Intuitiva**: Flujo de trabajo claro y fácil de seguir

### Funcionalidades

- 🔐 **Gestión de Wallets**: Sistema de múltiples wallets derivadas de Anvil
- 📄 **Carga de Archivos**: Soporte para múltiples tipos de archivo
- ✍️ **Firma Digital**: Generación de firmas usando claves privadas
- 🔍 **Verificación**: Verificación completa de autenticidad
- 📊 **Historial**: Visualización de todos los documentos almacenados
- 🔔 **Notificaciones**: Feedback visual para todas las operaciones

### Experiencia de Usuario

- 💬 **Mensajes Claros**: Feedback inmediato en todas las acciones
- ⏳ **Estados de Carga**: Indicadores visuales durante transacciones
- ✅ **Confirmaciones**: Diálogos de confirmación para operaciones críticas
- 🎨 **Tema Consistente**: Diseño coherente en toda la aplicación

---

## 🛠️ Tecnologías

### Core

- **Next.js 16.0.1**: Framework React con App Router
- **React 19.2.0**: Biblioteca de UI
- **TypeScript 5.0**: Tipado estático

### Blockchain

- **Ethers.js 6.15.0**: Interacción con Ethereum
- **Web3 Integration**: Conexión con wallets y contratos

### Estilos

- **Tailwind CSS 4.0**: Framework de utilidades CSS
- **Lucide React**: Iconos modernos

### Desarrollo

- **ESLint**: Linter para código JavaScript/TypeScript
- **PostCSS**: Procesamiento de CSS

---

## 📁 Estructura del Proyecto

```
dapp/
├── app/
│   ├── page.tsx                 # Página principal (con tabs)
│   ├── layout.tsx               # Layout principal
│   ├── globals.css              # Estilos globales
│   └── favicon.ico              # Favicon
│
├── components/
│   ├── FileUploader.tsx         # Componente de carga de archivos
│   ├── DocumentSigner.tsx       # Componente de firma de documentos
│   ├── DocumentVerifier.tsx     # Componente de verificación
│   ├── DocumentHistory.tsx      # Componente de historial
│   └── ConfirmDialog.tsx        # Diálogo de confirmación
│
├── contexts/
│   └── MetaMaskContext.tsx      # Context para gestión de wallets
│
├── hooks/
│   └── useContract.ts           # Hook para interactuar con el contrato
│
├── lib/
│   └── abi.ts                   # ABI del contrato DocumentRegistry
│
├── public/                      # Archivos estáticos
│   ├── file.svg
│   ├── globe.svg
│   └── ...
│
├── .env.local                   # Variables de entorno (no commitear)
├── next.config.ts               # Configuración de Next.js
├── tsconfig.json                # Configuración de TypeScript
├── tailwind.config.js           # Configuración de Tailwind
├── postcss.config.mjs           # Configuración de PostCSS
├── package.json                 # Dependencias del proyecto
└── README.md                    # Este archivo
```

---

## 🚀 Instalación

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (o yarn/pnpm)
- **Anvil** corriendo en `http://localhost:8545`
- **Contrato desplegado** en Anvil

### Instalación de Dependencias

```bash
# Desde el directorio dapp/
npm install

# O con yarn
yarn install

# O con pnpm
pnpm install
```

### Verificar Instalación

```bash
# Verificar que las dependencias se instalaron correctamente
npm list --depth=0
```

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` en el directorio `dapp/`:

```env
# Dirección del contrato desplegado
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# URL del RPC (Anvil local)
NEXT_PUBLIC_RPC_URL=http://localhost:8545

# Chain ID (31337 para Anvil)
NEXT_PUBLIC_CHAIN_ID=31337

# Mnemonic de Anvil (para derivar wallets)
NEXT_PUBLIC_MNEMONIC="test test test test test test test test test test test junk"
```

### Configuración Automática

El script `setup.sh` en la raíz del proyecto crea automáticamente este archivo.

### Verificar Configuración

```bash
# Verificar que las variables están cargadas
cat .env.local
```

---

## 🎯 Uso

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Funcionalidades Principales

#### 1. Conectar Wallet

1. Haz clic en "Conectar Wallet" en el header
2. Selecciona una de las 10 wallets disponibles
3. La wallet se conecta automáticamente

#### 2. Subir y Firmar Documento

1. Ve a la pestaña "Upload & Sign"
2. Selecciona un archivo (PDF, DOCX, TXT, etc.)
3. El hash se calcula automáticamente
4. Haz clic en "Sign Document"
5. Confirma la firma
6. Haz clic en "Store on Blockchain"
7. Confirma la transacción

#### 3. Verificar Documento

1. Ve a la pestaña "Verify"
2. Selecciona el archivo a verificar
3. Ingresa la dirección del firmante original
4. Haz clic en "Verify Document"
5. Verás el resultado: ✅ Válido o ❌ Inválido

#### 4. Ver Historial

1. Ve a la pestaña "History"
2. Visualiza todos los documentos almacenados
3. Información mostrada:
   - Hash del documento
   - Dirección del firmante
   - Fecha y hora
   - Firma digital

---

## 🧩 Componentes

### FileUploader

Componente para cargar archivos y calcular su hash.

**Props:**
```typescript
interface FileUploaderProps {
  onFileHash: (hash: string, file: File) => void;
  disabled?: boolean;
}
```

**Funcionalidades:**
- Carga de archivos con drag & drop (futuro)
- Cálculo automático de hash (Keccak256)
- Validación de tipo y tamaño
- Preview del archivo seleccionado

### DocumentSigner

Componente para firmar y almacenar documentos.

**Props:**
```typescript
interface DocumentSignerProps {
  fileHash: string;
  fileName: string;
  onDocumentStored: (txHash: string) => void;
}
```

**Funcionalidades:**
- Firma digital del documento
- Almacenamiento en blockchain
- Estados de carga y error
- Confirmaciones antes de acciones críticas

### DocumentVerifier

Componente para verificar la autenticidad de documentos.

**Funcionalidades:**
- Carga de archivo a verificar
- Entrada de dirección del firmante
- Verificación completa (hash + firma)
- Resultado visual claro

### DocumentHistory

Componente para visualizar el historial de documentos.

**Funcionalidades:**
- Lista de todos los documentos almacenados
- Información completa de cada documento
- Actualización en tiempo real
- Formato legible de fechas y direcciones

### ConfirmDialog

Componente reutilizable para diálogos de confirmación.

**Props:**
```typescript
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  confirmStyle: 'primary' | 'success' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}
```

---

## 🎣 Hooks Personalizados

### useContract

Hook para interactuar con el contrato inteligente.

```typescript
const {
  storeDocumentHash,
  verifyDocument,
  getDocumentInfo,
  isDocumentStored,
  getDocumentCount,
  getAllDocuments
} = useContract();
```

**Funciones disponibles:**
- `storeDocumentHash(hash, timestamp, signature, signer)`: Almacenar documento
- `verifyDocument(hash, signer, signature)`: Verificar documento
- `getDocumentInfo(hash)`: Obtener información del documento
- `isDocumentStored(hash)`: Verificar si existe
- `getDocumentCount()`: Obtener cantidad de documentos
- `getAllDocuments()`: Obtener todos los documentos

### useMetaMask (MetaMaskContext)

Hook para gestión de wallets.

```typescript
const {
  isConnected,
  currentWallet,
  currentWalletIndex,
  wallets,
  connect,
  disconnect,
  switchWallet,
  signMessage
} = useMetaMask();
```

**Funcionalidades:**
- Gestión de múltiples wallets
- Conexión/desconexión
- Cambio de wallet
- Firma de mensajes

---

## 💻 Desarrollo

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Build
npm run build        # Crear build de producción
npm run start        # Iniciar servidor de producción

# Linting
npm run lint         # Ejecutar ESLint
```

### Estructura de Desarrollo

#### Agregar Nuevo Componente

1. Crear archivo en `components/`
2. Exportar como default
3. Importar en `app/page.tsx` o donde se necesite

#### Agregar Nueva Funcionalidad al Contrato

1. Actualizar `lib/abi.ts` con el nuevo ABI
2. Agregar función en `hooks/useContract.ts`
3. Usar en los componentes necesarios

### Hot Reload

Next.js tiene hot reload automático. Los cambios se reflejan inmediatamente en el navegador.

### Debugging

```bash
# Ver logs en consola del navegador
# Abrir DevTools > Console

# Verificar conexión a blockchain
# Abrir DevTools > Network > Verificar llamadas RPC
```

---

## 🏗️ Build y Despliegue

### Build de Producción

```bash
npm run build
```

Esto crea una carpeta `.next/` con los archivos optimizados.

### Verificar Build

```bash
npm run build
npm run start
```

Visita `http://localhost:3000` para verificar que todo funciona.

### Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Vercel detectará Next.js automáticamente
4. El despliegue se realizará automáticamente

### Variables de Entorno en Producción

Asegúrate de configurar estas variables en tu plataforma de despliegue:

- `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_MNEMONIC` (solo para desarrollo)

### Despliegue en Otras Plataformas

#### Netlify

```bash
# Build command
npm run build

# Publish directory
.next
```

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Error: "Cannot connect to RPC"

**Solución:**
```bash
# Verificar que Anvil está corriendo
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545

# Verificar .env.local
cat .env.local
```

#### 2. Error: "Contract not deployed"

**Solución:**
- Verificar que el contrato está desplegado
- Verificar `NEXT_PUBLIC_CONTRACT_ADDRESS` en `.env.local`
- Verificar que la dirección es correcta

#### 3. Error: "Wallet not connected"

**Solución:**
- Hacer clic en "Conectar Wallet"
- Seleccionar una wallet disponible
- Verificar que Anvil está corriendo

#### 4. Error de Build

**Solución:**
```bash
# Limpiar cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

#### 5. Error de TypeScript

**Solución:**
```bash
# Verificar tipos
npm run build

# Ver errores específicos
npx tsc --noEmit
```

### Logs Útiles

```bash
# Ver logs del servidor de desarrollo
# Los logs aparecen en la terminal donde ejecutaste npm run dev

# Ver logs del navegador
# Abrir DevTools > Console

# Ver llamadas a la blockchain
# Abrir DevTools > Network > Filtrar por "localhost:8545"
```

---

## 📚 Recursos Adicionales

### Documentación

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tutoriales

- [Next.js Learn](https://nextjs.org/learn)
- [React Tutorial](https://react.dev/learn)
- [Ethers.js Guide](https://docs.ethers.org/v6/)

### Herramientas

- [Next.js DevTools](https://nextjs.org/docs/app/building-your-application/configuring/devtools)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Etherscan](https://etherscan.io/)

---

## 🎨 Personalización

### Cambiar Tema

Edita `app/globals.css` para personalizar los colores y estilos.

### Agregar Nuevas Funcionalidades

1. Crear componente en `components/`
2. Agregar ruta o tab en `app/page.tsx`
3. Actualizar navegación si es necesario

### Integrar con MetaMask Real

Para usar MetaMask real en lugar de wallets de Anvil:

1. Instalar `@metamask/detect-provider`
2. Modificar `contexts/MetaMaskContext.tsx`
3. Usar `window.ethereum` en lugar de wallets derivadas

---

## 🔒 Seguridad

### Consideraciones

- ⚠️ Las wallets de Anvil son solo para desarrollo
- ✅ Validación de entrada en todos los formularios
- ✅ Manejo de errores en todas las operaciones
- ✅ Confirmaciones para operaciones críticas

### Mejores Prácticas

1. Nunca commitees `.env.local`
2. Valida todas las entradas del usuario
3. Maneja errores de manera elegante
4. Usa TypeScript para type safety
5. Mantén dependencias actualizadas

---

## 📝 Licencia

Este proyecto es para fines educativos y de demostración.

---

<div align="center">

**Desarrollado con Next.js, React y Ethers.js**

[⬆ Volver al README principal](../README.md)

</div>
